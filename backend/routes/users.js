// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// 🔒 All user routes require authentication
router.get("/", verifyToken, userController.getUsers);           // Get users
router.post("/add", verifyToken, userController.addUser);        // Create user
router.delete("/delete", verifyToken, userController.deleteUserByName); // Delete user by username

module.exports = router;
