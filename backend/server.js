const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Import routes
const authRoutes = require('./routes/auth')
const scanRoutes = require('./routes/scans')
const pdfRoutes = require('./routes/pdf')

// Initialize database
require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/scans', scanRoutes)
app.use('/api/pdf', pdfRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`);
})