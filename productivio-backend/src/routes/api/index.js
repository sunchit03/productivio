// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const Task = require('../../models/Task');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/tasks

// Other routes (POST, DELETE, etc.) will go here later on...

//GET /v1/tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ title: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks: ', error });
  }
});

//POST /v1/tasks
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, dueDate, userId, priority } = req.body;
    const newTask = new Task({ title, description, status, dueDate, userId, priority });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding task: ', error });
  }
});

//DELETE /v1/tasks/id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

module.exports = router;
