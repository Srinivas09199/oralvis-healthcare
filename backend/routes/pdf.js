const express = require('express')
const { generatePDF } = require('../controllers/pdfController')
const auth = require('../middleware/auth')
const router = express.Router()

// Generate PDF report - Dentist only
router.get('/:id', auth('dentist'), generatePDF)

module.exports = router