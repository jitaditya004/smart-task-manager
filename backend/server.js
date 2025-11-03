const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // ✅ Allow React frontend
const db = require("./config/db.js");
const { verifyToken } = require("./middlewares/authMiddleware")

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve static files (if using React build)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
//const authRoutes = require("./routes/authRoutes");
const authRoutes = require(path.join(__dirname, "routes", "authRoutes"));
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/teams");


// ✅ Route mounting
app.use("/auth", authRoutes);  // ➤ /auth/register, /auth/login //remains public
app.use("/tasks",verifyToken, taskRoutes); // ➤ /tasks, /tasks/add, /tasks/update, etc.
app.use("/users",verifyToken, userRoutes);
app.use("/teams",verifyToken, teamRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Task Manager API is running...");
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
