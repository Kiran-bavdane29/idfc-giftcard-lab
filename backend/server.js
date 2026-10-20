const app = require('./src/app');
const { initDatabase } = require('./src/db/connection');
const config = require('./src/config');

// Auto-migrate + seed on boot so `docker-compose up` works with zero setup.
initDatabase();

app.listen(config.port, () => {
  console.log(`[idfc-giftcard-lab] backend listening on :${config.port}`);
  console.log('[idfc-giftcard-lab] WARNING: this app is intentionally vulnerable. Do NOT expose it.');
});
