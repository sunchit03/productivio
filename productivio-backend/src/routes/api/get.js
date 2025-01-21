// src/routes/api/get.js

const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

/**
 * Get a list of tasks for the current user
 */
router.get('/tasks', (req, res) => {
  // TODO: this is just a placeholder. To get something working, return an empty array...
  res.status(200).json({
    status: 'ok',
    tasks: 'something',
  });
});

module.exports = router;
