
// backend/config/db.js
const { Pool } = require("pg");
require("dotenv").config();

// Use DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // If you prefer separate fields instead of URL:
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT || 5432,
});

// Test connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully!");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Error:", err.message);
  }
})();

module.exports = pool;
