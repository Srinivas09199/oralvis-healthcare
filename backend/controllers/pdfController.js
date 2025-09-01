const PDFDocument = require('pdfkit')
const Scan = require('../models/Scan')

// Generate PDF report for a scan
const generatePDF = async (req, res) => {
  try {
    const { id } = req.params
    
    Scan.findById(id, async (err, scan) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching scan' })
      }
      
      if (!scan) {
        return res.status(404).json({ message: 'Scan not found' })
      }

      // Create a PDF document
      const doc = new PDFDocument()
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=scan-report-${scan.patient_id}.pdf`)
      
      // Pipe the PDF to the response
      doc.pipe(res)
      
      // Add content to the PDF
      doc.fontSize(20).text('OralVis Healthcare - Scan Report', { align: 'center' })
      doc.moveDown()
      
      doc.fontSize(14).text(`Patient Name: ${scan.patient_name}`)
      doc.text(`Patient ID: ${scan.patient_id}`)
      doc.text(`Scan Type: ${scan.scan_type}`)
      doc.text(`Region: ${scan.region}`)
      doc.text(`Upload Date: ${new Date(scan.upload_date).toLocaleDateString()}`)
      doc.moveDown()
      
      doc.text('Scan Image:')
      doc.moveDown()
      
      // Add image to PDF (this is a simplified version)
      // In a real application, you might need to download the image first
      doc.text(`Image URL: ${scan.image_url}`)
      
      // Finalize the PDF
      doc.end()
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { generatePDF }