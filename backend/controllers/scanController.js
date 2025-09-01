const cloudinary = require('cloudinary').v2
const Scan = require('../models/Scan')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload a new scan
const uploadScan = async (req, res) => {
  try {
    const { patient_name, patient_id, scan_type, region } = req.body
    const uploaded_by = req.user.id

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' })
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'oralvis-scans'
    });

    // Save scan data to database
    const scanData = {
      patient_name,
      patient_id,
      scan_type: scan_type || 'RGB',
      region,
      image_url: result.secure_url,
      uploaded_by
    }

    Scan.create(scanData, (err, scan) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving scan data' })
      }
      
      res.status(201).json({
        message: 'Scan uploaded successfully',
        scan
      })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all scans
const getAllScans = async (req, res) => {
  try {
    Scan.findAll((err, scans) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching scans' })
      }
      
      res.json({ scans })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Get a single scan by ID
const getScanById = async (req, res) => {
  try {
    const { id } = req.params
    
    Scan.findById(id, (err, scan) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching scan' })
      }
      
      if (!scan) {
        return res.status(404).json({ message: 'Scan not found' })
      }
      
      res.json({ scan })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { uploadScan, getAllScans, getScanById }