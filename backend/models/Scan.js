const db = require('../config/database')

class Scan {
  static create(scanData, callback) {
    const { patient_name, patient_id, scan_type, region, image_url, uploaded_by } = scanData
    const sql = `INSERT INTO scans (patient_name, patient_id, scan_type, region, image_url, uploaded_by) 
                 VALUES (?, ?, ?, ?, ?, ?)`
    db.run(sql, [patient_name, patient_id, scan_type, region, image_url, uploaded_by], function(err) {
      callback(err, { id: this.lastID, ...scanData })
    })
  }

  static findAll(callback) {
    const sql = `SELECT s.*, u.email as uploaded_by_email 
                 FROM scans s 
                 LEFT JOIN users u ON s.uploaded_by = u.id 
                 ORDER BY s.upload_date DESC`
    db.all(sql, [], (err, rows) => {
      callback(err, rows)
    })
  }

  static findById(id, callback) {
    const sql = `SELECT s.*, u.email as uploaded_by_email 
                 FROM scans s 
                 LEFT JOIN users u ON s.uploaded_by = u.id 
                 WHERE s.id = ?`
    db.get(sql, [id], (err, row) => {
      callback(err, row)
    })
  }
}

module.exports = Scan