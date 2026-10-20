const userRepo = require('../repositories/userRepository');
const giftCardRepo = require('../repositories/giftCardRepository');
const auditRepo = require('../repositories/auditRepository');
const adminService = require('../services/adminService');

// NOTE: all handlers sit behind `requireAdmin`, which trusts `x-admin: true`.
exports.listUsers = (req, res) => res.json({ users: userRepo.listAll() });

exports.setUserRole = (req, res, next) => {
  try {
    const u = userRepo.updateFields(req.params.id, { role: req.body.role });
    res.json(u);
  } catch (e) {
    next(e);
  }
};

exports.listAllCards = (req, res) => res.json({ cards: giftCardRepo.listAll() });

exports.catalogAll = (req, res) => res.json({ cards: giftCardRepo.listCatalogAll() });

exports.createCatalogCard = (req, res, next) => {
  try {
    res.status(201).json(giftCardRepo.createCatalog(req.body));
  } catch (e) {
    next(e);
  }
};

exports.updateCatalogCard = (req, res, next) => {
  try {
    // VULNERABILITY: mass assignment on catalog too — any column can be set.
    res.json(giftCardRepo.updateCatalog(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
};

exports.deleteCatalogCard = (req, res) => {
  giftCardRepo.softDeleteCatalog(req.params.id);
  res.json({ deleted: req.params.id });
};

exports.assign = (req, res, next) => {
  try {
    res.status(201).json(adminService.massAssign(req.body));
  } catch (e) {
    next(e);
  }
};

exports.audit = (req, res) => res.json({ logs: auditRepo.list(Number(req.query.limit) || 500) });
