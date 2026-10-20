function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT UNIQUE NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user',
      balance       REAL NOT NULL DEFAULT 1000,
      points        INTEGER NOT NULL DEFAULT 500,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS catalog_cards (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      brand          TEXT NOT NULL,
      name           TEXT NOT NULL,
      description    TEXT,
      value          REAL NOT NULL,
      price          REAL NOT NULL,
      points_price   INTEGER NOT NULL DEFAULT 0,
      discount_pct   REAL NOT NULL DEFAULT 0,
      active         INTEGER NOT NULL DEFAULT 1,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gift_cards (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      catalog_id   INTEGER REFERENCES catalog_cards(id),
      owner_id     INTEGER NOT NULL REFERENCES users(id),
      code         TEXT NOT NULL,
      pin          TEXT NOT NULL,
      message      TEXT,
      value        REAL NOT NULL,
      redeemed     INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      redeemed_at  TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER,
      method     TEXT NOT NULL,
      path       TEXT NOT NULL,
      status     INTEGER,
      ip         TEXT,
      body       TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { migrate };
