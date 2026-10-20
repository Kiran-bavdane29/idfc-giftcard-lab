const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,

  // VULNERABILITY (A06 / API2): hardcoded, weak, guessable JWT secret committed to source.
  // Anyone can forge tokens offline: jwt.sign(payload, 'secret123').
  jwtSecret: process.env.JWT_SECRET || 'secret123',
  jwtExpiresIn: '12h',

  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'giftcards.db'),

  // VULNERABILITY (API4): a fake internal API key left in source for secret scanners to find.
  internalApiKey: 'IDFC-INTERNAL-APIKEY-9f8d7c6b5a4e3f2g1h',
};
