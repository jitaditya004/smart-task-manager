// backend/routes/taskRoutes.js
const express = require("express");
const router = express.Router();

const upload = require("../config/uploadConfig");
const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.get("/", verifyToken, taskController.getTasks);


router.post("/add", verifyToken, taskController.addTask);


router.put("/update", verifyToken, taskController.updateTask);

// 🗑 Delete task
router.delete("/delete", verifyToken, taskController.deleteTask);


router.post("/attachments/:taskId", verifyToken, upload.single("attachment"), taskController.uploadAttachment);
router.get("/attachments/:taskId", verifyToken, taskController.getAttachments);
router.get("/download/:fileId", verifyToken, taskController.downloadAttachment);


module.exports = router;

