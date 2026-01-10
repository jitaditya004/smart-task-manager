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

//turns upload folder to public folder
//do this for public files, never for private files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  })
);
///code exposes uploads folder as a public url , serves files from it, and adds a cors header so those files can be accessed from any frontend,
// "/uploads" is url
//express.static is built-in express middleware that maps a folder on disk-- public urls
//setheader adds info to http response that tells browser how it is allowed to use the response
//as header of response has metadata , with rules , permission , types etc.
//so we use it to allow any website to access this response,
//browser blocks different origins like here frontend and backend on different ports
//without this header , preview or download dont work
//well i tried and it was taking me to file path but had frontend url at the begginning, so the same web page of frontend was opening


// ⭐ Enable parsing HttpOnly cookies
app.use(cookieParser());

// Serve static files if needed
//app.use(express.static(path.join(__dirname, "public")));
//express.static is built-in express middleware that maps a folder on disk-- public urls
//automatically handles file requests, "public" is folder naem 
//result is absolute path to public/


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
