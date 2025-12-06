// backend/controllers/userController.js
const db = require("../config/db");

// 🧠 GET USERS
exports.getUsers = async (req, res) => {
  try {
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      // Admin sees all users
      query = `
        SELECT id, username, role
        FROM users
        ORDER BY id ASC
      `;
      params = [];
    } else {
      // Normal users only see themselves
      query = `
        SELECT id, username, role
        FROM users
        WHERE id = $1
      `;
      params = [id];
    }

    const { rows } = await db.query(query, params);
    return res.json(rows);

  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    });
  }
};

// 🧠 ADD USER (ADMIN ONLY)
exports.addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const { role: userRole } = req.user; // logged-in user role

    // Only admin allowed
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create new users",
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required!",
      });
    }

    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
    `;

    await db.query(query, [username, password, role || "user"]);

    return res.json({
      success: true,
      message: "✅ User created successfully (admin)",
    });

  } catch (err) {
    console.error("❌ Add User Error:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Username already exists!",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to add user",
    });
  }
};

// 🧠 DELETE USER BY NAME (ADMIN ONLY)
exports.deleteUserByName = async (req, res) => {
  try {
    const { username } = req.body;
    const { role } = req.user;

    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete users",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required!",
      });
    }

    const query = `
      DELETE FROM users
      WHERE username = $1
    `;

    const result = await db.query(query, [username]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "✅ User deleted successfully (admin)",
    });

  } catch (err) {
    console.error("❌ Delete User Error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};
