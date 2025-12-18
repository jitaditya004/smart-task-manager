// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../config/uploadConfig");
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

// task attachment
router.post("/attachments/:taskId", verifyToken, upload.single("attachment"), taskController.uploadAttachment);
router.get("/attachments/:taskId", verifyToken, taskController.getAttachments);
router.get("/download/:fileId", verifyToken, taskController.downloadAttachment);


module.exports = router;

