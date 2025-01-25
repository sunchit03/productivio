// src/routes/api/delete.js

const express = require('express');
const database = require("../../config/database");

// Create a router on which to mount our API endpoints
const router = express.Router();

router.delete("/:id", async (req,res) => {
    try {
        const {id} = req.params;

        const task = await database.oneOrNone("SELECT * FROM tasks WHERE id = $1", [id]);
        if (!task) {
            return res.status(404).json({message : "Task not found"});
        }

        await database.none("DELETE FROM tasks WHERE id = $1", [id]);
        res.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting task", error});
    }
});

module.exports = router;