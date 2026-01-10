// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

require("dotenv").config();


const SECRET_KEY = process.env.JWT_SECRET;


router.get("/check", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user, // send role and id to frontend
  });
});

// --------------------------------------------------------
// 📝 SIGNUP
// --------------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username or email already exists
    const { rows: existingUser } = await db.query(
      `SELECT id FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username or Email already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (role always 'user')
    await db.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, 'user')`,
      [username, email, hashedPassword]
    );

    return res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Signup failed" });
  }
});




router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Find user
    const { rows } = await db.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // 2️⃣ Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    
    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,        // MUST be true in production
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });


    return res.json({
      success: true,
      message: "Login successful",
      username: user.username,
      role: user.role,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});



router.post("/logout",(req,res)=>{
  res.clearCookie("token",{secure:false,sameSite:"lax",httpOnly:true});
  res.json({success:true,message:"log out succes"});
});



module.exports = router;
