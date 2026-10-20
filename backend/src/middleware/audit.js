const { getDb } = require('../db/connection');

// Logs every API call (including full request bodies with passwords/tokens)
// into the audit_logs table.
function auditLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    try {
      getDb()
        .prepare(
          'INSERT INTO audit_logs (user_id, method, path, status, ip, body) VALUES (?,?,?,?,?,?)'
        )
        .run(
          req.user ? req.user.id : null,
          req.method,
          req.originalUrl.slice(0, 300),
          res.statusCode,
          req.ip,
          req.body && Object.keys(req.body).length
            ? JSON.stringify(req.body).slice(0, 2000)
            : null
        );
    } catch (e) {
      /* swallow logging errors */
    }
  });
  next();
}

module.exports = { auditLogger };
