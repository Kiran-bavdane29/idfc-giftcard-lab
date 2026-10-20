const { getDb } = require('../db/connection');

const userRepository = {
  findById(id) {
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
  },
  findByUsername(username) {
    return getDb().prepare('SELECT * FROM users WHERE username = ?').get(username);
  },
  findByEmail(email) {
    return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  create({ username, email, password_hash }) {
    const r = getDb()
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?,?,?)')
      .run(username, email, password_hash);
    return this.findById(r.lastInsertRowid);
  },
  listAll() {
    // VULNERABILITY (API3): returns password_hash to callers.
    return getDb().prepare('SELECT * FROM users ORDER BY id').all();
  },
  updateFields(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return this.findById(id);
    const sql = `UPDATE users SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`;
    getDb().prepare(sql).run(...keys.map((k) => fields[k]), id);
    return this.findById(id);
  },
  credit(id, amount) {
    getDb().prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, id);
    return this.findById(id);
  },
};

module.exports = userRepository;
