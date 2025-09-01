const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Check if user already exists
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' })
      }
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      // Create new user
      User.create({ email, password, role }, (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' })
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: { id: user.id, email: user.email, role: user.role }
        })
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    User.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' })
      }
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      // Check password
      const isMatch = bcrypt.compareSync(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, role: user.role }
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login }