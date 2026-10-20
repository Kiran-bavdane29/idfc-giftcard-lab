const express = require('express');
const { authRequired, requireAdmin } = require('../middleware/auth');
const auth = require('../controllers/authController');
const users = require('../controllers/userController');
const cards = require('../controllers/giftCardController');
const admin = require('../controllers/adminController');

const router = express.Router();

// ---- auth ----
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/users/me', authRequired, auth.me);

// ---- profile (BOPLA / mass assignment) ----
router.patch('/users/profile', authRequired, users.updateProfile);

// ---- storefront ----
router.get('/store/cards', authRequired, cards.catalog);
router.post('/store/purchase', authRequired, cards.purchase);

// ---- gift cards ----
// IMPORTANT: /search must be registered before /:id
router.get('/giftcards/search', authRequired, cards.search); // SQLi
router.get('/giftcards', authRequired, cards.myCards);
router.get('/giftcards/:id', authRequired, cards.getCard); // IDOR / BOLA
router.post('/giftcards/redeem', authRequired, cards.redeem); // race condition
router.post('/giftcards/transfer', authRequired, cards.transfer);

// ---- admin (broken access control: trusts `x-admin: true` header) ----
router.get('/admin/users', authRequired, requireAdmin, admin.listUsers);
router.patch('/admin/users/:id/role', authRequired, requireAdmin, admin.setUserRole);
router.get('/admin/giftcards', authRequired, requireAdmin, admin.listAllCards);
router.get('/admin/catalog', authRequired, requireAdmin, admin.catalogAll);
router.post('/admin/catalog', authRequired, requireAdmin, admin.createCatalogCard);
router.patch('/admin/catalog/:id', authRequired, requireAdmin, admin.updateCatalogCard);
router.delete('/admin/catalog/:id', authRequired, requireAdmin, admin.deleteCatalogCard);
router.post('/admin/giftcards/assign', authRequired, requireAdmin, admin.assign);
router.get('/admin/audit', authRequired, requireAdmin, admin.audit);

module.exports = router;
