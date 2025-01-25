// src/routes/api/get.js

const express = require('express');
const database = require("../../config/database");

// Create a router on which to mount our API endpoints
const router = express.Router();

// Create a table if not created already
const createTable = async () => {
  await database.none(`
        CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
        due_date TIMESTAMP DEFAULT NULL,
        priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'low',
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
};
createTable();


/**
 * Get a list of tasks for the current user
 */
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await database.any("SELECT * FROM tasks ORDER BY created_at DESC");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({message: "Error fetching tasks: ", error});
  }
})

module.exports = router;
