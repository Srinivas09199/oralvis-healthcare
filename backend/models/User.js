const db = require('../config/database')
const bcrypt = require('bcryptjs')

class User {
  static create(user, callback) {
    const { email, password, role } = user
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    const sql = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`
    db.run(sql, [email, hashedPassword, role], function(err) {
      callback(err, { id: this.lastID, email, role })
    })
  }

  static findByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`
    db.get(sql, [email], (err, row) => {
      callback(err, row)
    })
  }

  static findById(id, callback) {
    const sql = `SELECT id, email, role, created_at FROM users WHERE id = ?`
    db.get(sql, [id], (err, row) => {
      callback(err, row)
    })
  }
}

module.exports = User