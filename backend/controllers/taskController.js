// backend/controllers/taskController.js
const db = require("../config/db");

// 🧠 GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query, params;

    if (role === "admin") {
      query = `
        SELECT t.id, t.title, t.description, t.status, t.priority, u.username AS assigned_to, t.deadline
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        ORDER BY t.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT t.id, t.title, t.description, t.status, t.priority, u.username AS assigned_to, t.deadline
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.assigned_to = $1 OR t.created_by = $2
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

// 🧠 ADD TASK
exports.addTask = async (req, res) => {
  try {
    const { title, description, assigned_to, team_id, deadline, priority } = req.body;
    const { id } = req.user;

    // If no team_id → personal task
    const isPersonal = !team_id;
    const finalAssignedTo = isPersonal ? id : assigned_to;

    const query = `
      INSERT INTO tasks (title, description, assigned_to, team_id, deadline, created_by, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await db.query(query, [
      title,
      description,
      finalAssignedTo,
      team_id || null, 
      deadline,
      id,
      priority || "medium"
    ]);

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

// 🧠 UPDATE TASK
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
