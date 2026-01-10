// backend/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 
require("dotenv").config();

const app = express();

// Load Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/teams");



app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:5173
    credentials: true,              //  MUST for cookie auth
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//turns upload folder to public folder
//do this for public files, never for private files
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"), {
//     setHeaders: (res, filePath) => {
//       res.setHeader("Access-Control-Allow-Origin", "*");
//     }
//   })
// );

app.use(cookieParser());


app.use("/auth", authRoutes);

// Protected routes → they include verifyToken INSIDE each route file
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Task Manager API is running...");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
