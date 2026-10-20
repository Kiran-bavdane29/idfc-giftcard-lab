const { getDb } = require('../db/connection');

const giftCardRepository = {
  // ---- catalog ----
  listCatalog() {
    return getDb().prepare('SELECT * FROM catalog_cards WHERE active = 1 ORDER BY id').all();
  },
  listCatalogAll() {
    return getDb().prepare('SELECT * FROM catalog_cards ORDER BY id').all();
  },
  findCatalog(id) {
    return getDb().prepare('SELECT * FROM catalog_cards WHERE id = ?').get(id);
  },
  createCatalog(c) {
    const r = getDb()
      .prepare(
        'INSERT INTO catalog_cards (brand, name, description, value, price, points_price, discount_pct) VALUES (?,?,?,?,?,?,?)'
      )
      .run(c.brand, c.name, c.description || '', c.value, c.price, c.points_price || 0, c.discount_pct || 0);
    return this.findCatalog(r.lastInsertRowid);
  },
  updateCatalog(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return this.findCatalog(id);
    const sql = `UPDATE catalog_cards SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`;
    getDb().prepare(sql).run(...keys.map((k) => fields[k]), id);
    return this.findCatalog(id);
  },
  softDeleteCatalog(id) {
    getDb().prepare('UPDATE catalog_cards SET active = 0 WHERE id = ?').run(id);
  },

  // ---- owned gift cards ----
  createCard({ catalog_id, owner_id, code, pin, message, value }) {
    const r = getDb()
      .prepare(
        'INSERT INTO gift_cards (catalog_id, owner_id, code, pin, message, value) VALUES (?,?,?,?,?,?)'
      )
      .run(catalog_id, owner_id, code, pin, message, value);
    return this.findById(r.lastInsertRowid);
  },
  findById(id) {
    return getDb()
      .prepare(
        `SELECT g.*, c.brand, c.name AS catalog_name, u.username AS owner_username
         FROM gift_cards g
         LEFT JOIN catalog_cards c ON c.id = g.catalog_id
         LEFT JOIN users u ON u.id = g.owner_id
         WHERE g.id = ?`
      )
      .get(id);
  },
  findByCode(code) {
    return getDb().prepare('SELECT * FROM gift_cards WHERE code = ?').get(code);
  },
  listByOwner(ownerId) {
    return getDb()
      .prepare(
        `SELECT g.*, c.brand, c.name AS catalog_name
         FROM gift_cards g LEFT JOIN catalog_cards c ON c.id = g.catalog_id
         WHERE g.owner_id = ? ORDER BY g.id`
      )
      .all(ownerId);
  },
  listAll() {
    return getDb()
      .prepare(
        `SELECT g.*, c.brand, c.name AS catalog_name, u.username AS owner_username
         FROM gift_cards g
         LEFT JOIN catalog_cards c ON c.id = g.catalog_id
         LEFT JOIN users u ON u.id = g.owner_id
         ORDER BY g.id`
      )
      .all();
  },
  markRedeemed(id) {
    getDb().prepare("UPDATE gift_cards SET redeemed = 1, redeemed_at = datetime('now') WHERE id = ?").run(id);
  },
  transfer(id, newOwnerId) {
    getDb().prepare('UPDATE gift_cards SET owner_id = ? WHERE id = ?').run(newOwnerId, id);
    return this.findById(id);
  },

  // VULNERABILITY (A03 / API8): SQL injection — user input is concatenated
  // straight into the query. Supports UNION SELECT extraction of any table.
  searchRaw(term) {
    const sql =
      `SELECT g.id, g.code, g.pin, g.message, g.value, g.redeemed, ` +
      `c.brand, c.name AS catalog_name, u.username AS owner_username ` +
      `FROM gift_cards g ` +
      `LEFT JOIN catalog_cards c ON c.id = g.catalog_id ` +
      `LEFT JOIN users u ON u.id = g.owner_id ` +
      `WHERE c.brand LIKE '%${term}%' OR c.name LIKE '%${term}%' OR g.message LIKE '%${term}%'`;
    return getDb().prepare(sql).all();
  },
};

module.exports = giftCardRepository;
