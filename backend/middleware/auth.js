const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles]
  }

  return (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      
      // Check if user has required role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
      }
      
      next()
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' })
    }
  }
}

module.exports = auth