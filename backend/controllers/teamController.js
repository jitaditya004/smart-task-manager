const db = require("../config/db");

// 🧠 GET TEAMS
exports.getTeams = async (req, res) => {
  try {
    const { role, id } = req.user;
    let query, params;

    if (role === "admin") {
      // Admin sees all teams
      query = "SELECT id, name, created_by FROM teams ORDER BY id ASC";
      params = [];
    } else {
      // Normal users see only their teams
      query = "SELECT id, name FROM teams WHERE created_by = ? ORDER BY id ASC";
      params = [id];
    }

    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error("❌ Fetch Teams Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch teams" });
  }
};

// 🧠 ADD TEAM
exports.addTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.user;

    const query = "INSERT INTO teams (name, created_by) VALUES (?, ?)";
    await db.query(query, [name, id]);

    res.json({ success: true, message: "✅ Team added successfully" });
  } catch (err) {
    console.error("❌ Add Team Error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Team name already exists!" });
    }

    res.status(500).json({ success: false, error: "Failed to add team" });
  }
};

// 🧠 DELETE TEAM
exports.deleteTeamByName = async (req, res) => {
  try {
    const { name } = req.body;
    const { id, role } = req.user;

    let query, params;

    if (role === "admin") {
      query = "DELETE FROM teams WHERE name=?";
      params = [name];
    } else {
      query = "DELETE FROM teams WHERE name=? AND created_by=?";
      params = [name, id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "❌ Not authorized or team not found" });
    }

    res.json({ success: true, message: "✅ Team deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Team Error:", err);
    res.status(500).json({ success: false, error: "Failed to delete team" });
  }
};
