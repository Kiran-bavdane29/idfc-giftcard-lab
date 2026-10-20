const giftCardService = require('../services/giftCardService');
const giftCardRepo = require('../repositories/giftCardRepository');

exports.catalog = (req, res) => res.json({ cards: giftCardRepo.listCatalog() });

exports.myCards = (req, res) => res.json({ cards: giftCardRepo.listByOwner(req.user.id) });

// GET /giftcards/:id — IDOR: returns code + PIN of ANY user's card.
exports.getCard = (req, res, next) => {
  try {
    res.json(giftCardService.getCard(req.params.id));
  } catch (e) {
    next(e);
  }
};

// GET /giftcards/search?q= — SQL injection endpoint.
exports.search = (req, res, next) => {
  try {
    res.json({ results: giftCardService.search(req.query.q) });
  } catch (e) {
    next(e);
  }
};

exports.purchase = async (req, res, next) => {
  try {
    const card = await giftCardService.purchase(req.user.id, req.body.catalog_id, req.body);
    res.status(201).json(card);
  } catch (e) {
    next(e);
  }
};

// POST /giftcards/redeem — race condition: fire N parallel requests with the
// same code to credit N x value.
exports.redeem = async (req, res, next) => {
  try {
    res.json(await giftCardService.redeem(req.user.id, req.body.code));
  } catch (e) {
    next(e);
  }
};

exports.transfer = (req, res, next) => {
  try {
    res.json(giftCardService.transfer(req.user.id, req.body.card_id, req.body.recipient));
  } catch (e) {
    next(e);
  }
};
