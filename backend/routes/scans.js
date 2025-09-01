const express = require('express')
const { uploadScan, getAllScans, getScanById } = require('../controllers/scanController')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const router = express.Router()

// Upload scan - Technician only
router.post('/upload', auth('technician'), upload.single('scanImage'), uploadScan)

// Get all scans - Dentist only
router.get('/', auth('dentist'), getAllScans)

// Get single scan by ID - Dentist only
router.get('/:id', auth('dentist'), getScanById)

module.exports = router