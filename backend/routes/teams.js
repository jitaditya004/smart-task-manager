// backend/routes/teamRoutes.js
const express = require("express");
const router = express.Router();

const teamController = require("../controllers/teamController");
const { verifyToken } = require("../middlewares/authMiddleware");

// 🔒 All team routes require authentication
router.get("/", verifyToken, teamController.getTeams);               // Get teams
router.post("/add", verifyToken, teamController.addTeam);            // Create team
router.delete("/delete", verifyToken, teamController.deleteTeamByName); // Delete team by name

module.exports = router;
