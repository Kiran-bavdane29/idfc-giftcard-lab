const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function makeCode(prefix = 'IDFC') {
  return `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
}
function makePin() {
  return String(crypto.randomInt(1000, 9999));
}

function seed(db) {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const insertUser = db.prepare(
      'INSERT INTO users (username, email, password_hash, role, balance, points) VALUES (?,?,?,?,?,?)'
    );
    insertUser.run('admin', 'admin@idfcfirst.lab', bcrypt.hashSync('admin123', 10), 'admin', 500000, 100000);
    insertUser.run('alice', 'alice@example.com', bcrypt.hashSync('alice123', 10), 'user', 5000, 1200);
    insertUser.run('bob', 'bob@example.com', bcrypt.hashSync('bob123', 10), 'user', 2500, 800);
    console.log('[seed] users created: admin/admin123, alice/alice123, bob/bob123');
  }

  const catCount = db.prepare('SELECT COUNT(*) AS c FROM catalog_cards').get().c;
  if (catCount === 0) {
    const insertCat = db.prepare(
      'INSERT INTO catalog_cards (brand, name, description, value, price, points_price, discount_pct) VALUES (?,?,?,?,?,?,?)'
    );
    insertCat.run('Amazon', 'Amazon Shopping Voucher', 'Rs.500 Amazon India e-voucher', 500, 475, 5000, 5);
    insertCat.run('Amazon', 'Amazon Prime Gift Card', 'Rs.1000 Amazon gift card', 1000, 950, 10000, 5);
    insertCat.run('Flipkart', 'Flipkart E-Gift Voucher', 'Rs.750 Flipkart voucher', 750, 720, 7500, 4);
    insertCat.run('Myntra', 'Myntra Style Card', 'Rs.1000 Myntra fashion voucher', 1000, 900, 10000, 10);
    insertCat.run('Swiggy', 'Swiggy Food Voucher', 'Rs.300 Swiggy voucher', 300, 290, 3000, 3);
    insertCat.run('IDFC FIRST', 'Rewards Mega Card', 'Rs.5000 premium brand voucher', 5000, 4500, 50000, 10);
  }

  const cardCount = db.prepare('SELECT COUNT(*) AS c FROM gift_cards').get().c;
  if (cardCount === 0) {
    const insertCard = db.prepare(
      'INSERT INTO gift_cards (catalog_id, owner_id, code, pin, message, value, redeemed) VALUES (?,?,?,?,?,?,?)'
    );
    // alice (id 2) owns card id 1+2, bob (id 3) owns card id 3 -- perfect IDOR targets.
    insertCard.run(1, 2, 'IDFC-AMAZON-DEMO1', '4321', 'Happy Birthday Alice!', 500, 0);
    insertCard.run(3, 2, makeCode('FLPK'), makePin(), 'Enjoy shopping', 750, 0);
    insertCard.run(4, 3, 'IDFC-MYNTRA-DEMO3', '9876', '<b>For Bob</b>', 1000, 0);
    console.log('[seed] demo gift cards created');
  }
}

module.exports = { seed, makeCode, makePin };
