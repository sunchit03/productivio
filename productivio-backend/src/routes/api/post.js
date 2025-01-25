// src/routes/api/post.js

const express = require('express');
const database = require("../../config/database");

// Create a router on which to mount our API endpoints
const router = express.Router();
router.post("/tasks", async(req,res) => {
    try {
        const {title, description, status, due_date, priority} = req.body;
        const newTask = await database.one(
            "INSERT INTO tasks (title, description, status, due_date, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, description, status || "pending", due_date || null, priority || 'low']
        );
        res.status(201).json(newTask);
    } catch (error){
        res.status(500).json({message: "Error adding task: ", error});
    }
});

module.exports = router;