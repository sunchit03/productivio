const pgp = require("pg-promise")();
require("dotenv").config();

// Database connection settings
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false, // Required for cloud databases
});

module.exports = db;