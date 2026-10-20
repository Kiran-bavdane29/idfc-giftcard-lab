const jwt = require('jsonwebtoken');
const config = require('../config');

function decodeHeader(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// VULNERABILITY (API2 / A02): broken JWT verification.
//  1. Tokens with header {"alg":"none"} are accepted with NO signature check.
//  2. The symmetric secret is 'secret123', so HS256 tokens are trivially forgeable.
//  3. Expiry is only checked for the HS256 path.
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing_token' });

  const jwtHeader = decodeHeader(token);
  if (jwtHeader && jwtHeader.alg === 'none') {
    req.user = jwt.decode(token); // accepted blindly — no verification
    return next();
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token', detail: e.message });
  }
}

// VULNERABILITY (API5 / A01): broken access control.
// Admin authorization trusts a client-controlled `x-admin: true` header and the
// (forgeable) JWT role claim. All admin routes effectively rely on front-end state.
function requireAdmin(req, res, next) {
  if (req.headers['x-admin'] === 'true') return next();
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'forbidden', hint: 'try x-admin: true' });
}

module.exports = { authRequired, requireAdmin };
