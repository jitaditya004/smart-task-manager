const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middlewares/authMiddleware");


// 🧠 All routes below now require authentication
router.get("/", verifyToken, taskController.getTasks);
router.post("/add", verifyToken, taskController.addTask);
router.post("/update", verifyToken, taskController.updateTask);
router.post("/delete", verifyToken, taskController.deleteTask);

module.exports = router;
