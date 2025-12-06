// backend/controllers/teamController.js
const db = require("../config/db");

// 🧠 GET TEAMS
exports.getTeams = async (req, res) => {
  try {
    const { role, id } = req.user;
    let query, params;

    if (role === "admin") {
      // Admin sees all teams
      query = `
        SELECT id, name, created_by 
        FROM teams 
        ORDER BY id ASC
      `;
      params = [];
    } else {
      // Normal users see only teams they created
      query = `
        SELECT id, name 
        FROM teams 
        WHERE created_by = $1 
        ORDER BY id ASC
      `;
      params = [id];
    }

    const { rows } = await db.query(query, params);
    return res.json(rows);

  } catch (err) {
    console.error("❌ Fetch Teams Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch teams"
    });
  }
};

// 🧠 ADD TEAM
exports.addTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.user;

    const query = `
      INSERT INTO teams (name, created_by) 
      VALUES ($1, $2)
    `;

    await db.query(query, [name, id]);

    return res.json({
      success: true,
      message: "✅ Team added successfully"
    });

  } catch (err) {
    console.error("❌ Add Team Error:", err);

    // PostgreSQL duplicate error
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Team name already exists!"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to add team"
    });
  }
};

// 🧠 DELETE TEAM
exports.deleteTeamByName = async (req, res) => {
  try {
    const { name } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = `
        DELETE FROM teams 
        WHERE name = $1
      `;
      params = [name];
    } else {
      query = `
        DELETE FROM teams 
        WHERE name = $1 AND created_by = $2
      `;
      params = [name, id];
    }

    const result = await db.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "❌ Not authorized or team not found"
      });
    }

    return res.json({
      success: true,
      message: "✅ Team deleted successfully"
    });

  } catch (err) {
    console.error("❌ Delete Team Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to delete team"
    });
  }
};
