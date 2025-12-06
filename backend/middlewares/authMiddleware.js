// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  try {
    // 1️⃣ Read token from secure HttpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // 2️⃣ Verify & decode token (ensures correct algorithm)
    const decoded = jwt.verify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    // 3️⃣ Attach user to request object
    req.user = decoded;

    return next();

  } catch (err) {
    console.error("JWT Verification Error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid or malformed authentication token.",
    });
  }
}

module.exports = { verifyToken };
