const express = require('express')
const { register, login } = require('../controllers/authController')
const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth service is running' });
});

// Register route
router.post('/register', register)

// Login route
router.post('/login', login)

module.exports = router