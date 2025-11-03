const db = require("./config/db.js");

db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) throw err;
    console.log("Query works:", results);
    process.exit();
});
