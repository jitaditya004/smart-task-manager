const db = require("../config/db");

// 🧠 GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query, params;

    if (role === "admin") {
      query = `
        SELECT t.id, t.title, t.description, t.status, u.username AS assigned_to, t.deadline
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        ORDER BY t.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT t.id, t.title, t.description, t.status, u.username AS assigned_to, t.deadline
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.assigned_to = ? OR t.created_by = ?
        ORDER BY t.created_at DESC
      `;
      params = [id, id];
    }

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tasks" });
  }
};

// 🧠 ADD TASK
// 🧠 ADD TASK
exports.addTask = async (req, res) => {
  try {
    const { title, description, assigned_to, team_id, deadline } = req.body;
    const { id, role } = req.user;

    // 🧩 If no team_id is provided → personal task
    const isPersonal = !team_id;

    // 🧩 Personal task → assigned_to must be the current user
    const finalAssignedTo = isPersonal ? id : assigned_to;

    const query = `
      INSERT INTO tasks (title, description, assigned_to, team_id, deadline, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      title,
      description,
      finalAssignedTo,
      team_id || null, // null for personal tasks
      deadline,
      id,
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
      query = "UPDATE tasks SET status=? WHERE id=?";
      params = [status, taskId];
    } else {
      query = "UPDATE tasks SET status=? WHERE id=? AND (assigned_to=? OR created_by=?)";
      params = [status, taskId, id, id];
    }

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "You are not authorized to update this task" });

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
      query = "DELETE FROM tasks WHERE id=?";
      params = [taskId];
    } else {
      query = "DELETE FROM tasks WHERE id=? AND (assigned_to=? OR created_by=?)";
      params = [taskId, id, id];
    }

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "You are not authorized to delete this task" });

    res.json({ success: true, message: "✅ Task deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Task Error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
