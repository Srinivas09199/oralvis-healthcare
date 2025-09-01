const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = process.env.NODE_ENV ==='production' ?
 '/tmp/database.sqlite' : path.join(__dirname, '..', 'database.sqlite')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database Connection Failed:', err.message)
  } else {
    console.log('Connected to SQLite Database.')
    
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('technician', 'dentist')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`)
    
    // Create scans table
    db.run(`CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      scan_type TEXT DEFAULT 'RGB',
      region TEXT NOT NULL CHECK(region IN ('Frontal', 'Upper Arch', 'Lower Arch')),
      image_url TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      uploaded_by INTEGER,
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    )`)
  }
})

module.exports = db