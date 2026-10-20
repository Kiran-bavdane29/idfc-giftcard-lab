const { getDb } = require('../db/connection');

module.exports = {
  list(limit = 500) {
    return getDb().prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?').all(limit);
  },
};
