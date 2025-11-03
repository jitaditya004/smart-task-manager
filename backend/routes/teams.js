const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { verifyToken } = require("../middlewares/authMiddleware"); // 👈 import middleware

// 🧠 Routes with token verification
router.get("/", verifyToken, teamController.getTeams);
router.post("/addTeam", verifyToken, teamController.addTeam);
router.post("/deleteTeamByName", verifyToken, teamController.deleteTeamByName);

module.exports = router;
