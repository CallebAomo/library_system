const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "library_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;