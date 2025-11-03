const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, userController.getUsers);
router.post("/addUser", verifyToken, userController.addUser);
router.post("/deleteUserByName", verifyToken, userController.deleteUserByName);


module.exports = router;
