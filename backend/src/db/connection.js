const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');
const { migrate } = require('./migrate');
const { seed } = require('./seed');

let db;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
    db = new Database(config.dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDatabase() {
  const conn = getDb();
  migrate(conn);
  seed(conn);
  return conn;
}

module.exports = { getDb, initDatabase };
