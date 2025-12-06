// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ⭐ REQUIRED for HttpOnly cookies
require("dotenv").config();

const app = express();

// Load Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/teams");

// ------------------------------------------------------
// GLOBAL MIDDLEWARES
// ------------------------------------------------------

// CORS for frontend communication + cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:5173
    credentials: true,              // ⭐ MUST for cookie auth
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ Enable parsing HttpOnly cookies
app.use(cookieParser());

// Serve static files if needed
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------

// Public route (signup, login)
app.use("/auth", authRoutes);

// Protected routes → they include verifyToken INSIDE each route file
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Task Manager API is running...");
});

// ------------------------------------------------------
// START SERVER
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
