const db = require("../config/db");

// 🧠 GET USERS
exports.getUsers = async (req, res) => {
  try {
    const { id, role } = req.user; // from JWT token

    let query, params;

    if (role === "admin") {
      // Admin can see everyone
      query = "SELECT id, username FROM users ORDER BY id ASC";
      params = [];
    } else {
      // Normal user: only see their own created users and themselves
      query = "SELECT id, username FROM users WHERE id = ? OR created_by = ? ORDER BY id ASC";
      params = [id, id];
    }

    const [results] = await db.query(query, params);
    res.json(results);

  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
};

// 🧠 ADD USER
exports.addUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { id, role } = req.user;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required!" });
    }

    let query, params;

    if (role === "admin") {
      // Admin can add anyone
      query = "INSERT INTO users (username, password, created_by) VALUES (?, ?, ?)";
      params = [username, password, id];
    } else {
      // Normal user can only create users under themselves
      query = "INSERT INTO users (username, password, created_by) VALUES (?, ?, ?)";
      params = [username, password, id];
    }

    await db.query(query, params);

    res.json({ success: true, message: "✅ User added successfully" });

  } catch (err) {
    console.error("❌ Add User Error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Username already exists!" });
    }

    res.status(500).json({ success: false, error: "Failed to add user" });
  }
};

// 🧠 DELETE USER BY NAME
exports.deleteUserByName = async (req, res) => {
  try {
    const { username } = req.body;
    const { id, role } = req.user;

    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required!" });
    }

    let query, params;

    if (role === "admin") {
      query = "DELETE FROM users WHERE username=?";
      params = [username];
    } else {
      query = "DELETE FROM users WHERE username=? AND created_by=?";
      params = [username, id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(403).json({ success: false, message: "You are not authorized or user not found" });
    }

    res.json({ success: true, message: "✅ User deleted successfully" });

  } catch (err) {
    console.error("❌ Delete User Error:", err);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
};
