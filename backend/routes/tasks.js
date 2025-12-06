// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middlewares/authMiddleware");

// 🔒 All routes require authentication
router.get("/", verifyToken, taskController.getTasks);

// 📝 Create task
router.post("/add", verifyToken, taskController.addTask);

// ✏️ Update task
router.put("/update", verifyToken, taskController.updateTask);

// 🗑 Delete task
router.delete("/delete", verifyToken, taskController.deleteTask);

module.exports = router;

