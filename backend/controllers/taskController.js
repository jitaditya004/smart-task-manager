// backend/controllers/taskController.js
const db = require("../config/db");

// 🧠 GET TASKS (WITH ATTACHMENTS FIX)
exports.getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query, params;

    if (role === "admin") {
      query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.deadline,
          u.username AS assigned_to,

          COALESCE(
            json_agg(
              json_build_object(
                'id', a.id,
                'file_path', a.file_path,
                'file_name', a.file_name,
                'file_type', a.file_type
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS attachments

        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN task_attachments a ON a.task_id = t.id

        GROUP BY t.id, u.username
        ORDER BY t.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.deadline,
          u.username AS assigned_to,

          COALESCE(
            json_agg(
              json_build_object(
                'id', a.id,
                'file_path', a.file_path,
                'file_name', a.file_name,
                'file_type', a.file_type
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS attachments

        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN task_attachments a ON a.task_id = t.id

        WHERE t.assigned_to = $1 OR t.created_by = $2
        GROUP BY t.id, u.username
        ORDER BY t.created_at DESC
      `;
      params = [id, id];
    }

    const { rows } = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};




const scheduleTaskEmail = require("../utils/scheduleTaskEmail");


exports.addTask = async (req, res) => {


  try {
    const { title, description, assigned_to, team_id, deadline, priority } = req.body;
    const { id } = req.user;
      if (deadline) {
    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate)) {
      return res.status(400).json({ error: "Invalid deadline format" });
    }

    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        error: "Deadline must be in the future",
      });
    }
  }

    const isPersonal = !team_id;
    const finalAssignedTo = isPersonal ? id : assigned_to;

    const result = await db.query(
      `
      INSERT INTO tasks (title, description, assigned_to, team_id, deadline, created_by, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        title,
        description,
        finalAssignedTo,
        team_id || null,
        deadline || null,
        id,
        priority || "medium",
      ]
    );

    // 🔍 Get user email
    if (deadline) {
      const { rows } = await db.query(
        `SELECT email FROM users WHERE id = $1`,
        [finalAssignedTo]
      );

      if (rows.length) {
        scheduleTaskEmail({
          email: rows[0].email,
          title,
          deadline,
        });
      }
    }

    res.json({
      success: true,
      message: isPersonal
        ? "✅ Personal task added successfully"
        : "✅ Team task added successfully",
    });
  } catch (err) {
    console.error("❌ Add Task Error:", err);
    res.status(500).json({ error: "Failed to add task" });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { id: taskId, status } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = "UPDATE tasks SET status=$1 WHERE id=$2";
      params = [status, taskId];
    } else {
      query =
        "UPDATE tasks SET status=$1 WHERE id=$2 AND (assigned_to=$3 OR created_by=$4)";
      params = [status, taskId, id, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0)
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });

    res.json({ success: true, message: "✅ Task updated successfully" });
  } catch (err) {
    console.error("❌ Update Task Error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};



// 🧠 DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id: taskId } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = "DELETE FROM tasks WHERE id=$1";
      params = [taskId];
    } else {
      query =
        "DELETE FROM tasks WHERE id=$1 AND (assigned_to=$2 OR created_by=$3)";
      params = [taskId, id, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this task" });

    res.json({ success: true, message: "✅ Task deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Task Error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};


// TASK ATTACHMENTS
const supabase = require("../config/supabase");

exports.uploadAttachment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `tasks/${taskId}/${Date.now()}-${file.originalname}`;

    // ⬆ Upload to Supabase
    const { error } = await supabase.storage
      .from("attachment")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    // ⬆ Get public URL
    const { data } = supabase.storage
      .from("attachment")
      .getPublicUrl(fileName);

    // ⬆ Save URL in DB
    await db.query(
      `INSERT INTO task_attachments (task_id, file_path, file_name, file_type)
       VALUES ($1, $2, $3, $4)`,
      [taskId, data.publicUrl, file.originalname, file.mimetype]
    );

    res.json({
      success: true,
      message: "File uploaded successfully",
      fileUrl: data.publicUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

exports.getAttachments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { rows } = await db.query(
      `SELECT id, file_path, file_name, file_type, uploaded_at 
       FROM task_attachments 
       WHERE task_id = $1`,
      [taskId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attachments" });
  }
};


const path = require("path");
const axios = require("axios");

exports.downloadAttachment = async (req, res) => {
  try {
    const { fileId } = req.params;

    const { rows } = await db.query(
      `SELECT file_path, file_name FROM task_attachments WHERE id = $1`,
      [fileId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileUrl = rows[0].file_path;
    const fileName = rows[0].file_name;

    const response = await axios.get(fileUrl, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    res.setHeader("Content-Type", "application/octet-stream");

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
};
//no signed url