const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { auditLogger } = require('./middleware/audit');

const app = express();

// Permissive CORS for the lab (front-end dev server on :5173, nginx on :3000).
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// VULNERABILITY (API8): every request + body is written to the audit_logs table,
// including passwords and tokens. Admin-only read, but see the broken admin check.
app.use(auditLogger);

app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', lab: true }));
app.use('/api/v1', routes);

app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));

// VULNERABILITY: verbose stack traces leaked to clients.
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'internal_error',
    stack: err.stack,
  });
});

module.exports = app;
