const crypto = require('crypto');
const giftCardRepo = require('../repositories/giftCardRepository');
const userRepo = require('../repositories/userRepository');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeCode(brand = 'IDFC') {
  return `${brand.slice(0, 4).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

const giftCardService = {
  async purchase(userId, catalogId, { message = '', payWith = 'balance' } = {}) {
    const tpl = giftCardRepo.findCatalog(catalogId);
    if (!tpl || !tpl.active) {
      const e = new Error('catalog card not found');
      e.status = 404;
      throw e;
    }
    const user = userRepo.findById(userId);
    if (payWith === 'points') {
      if (user.points < tpl.points_price) {
        const e = new Error('insufficient points');
        e.status = 402;
        throw e;
      }
      userRepo.updateFields(userId, { points: user.points - tpl.points_price });
    } else {
      if (user.balance < tpl.price) {
        const e = new Error('insufficient balance');
        e.status = 402;
        throw e;
      }
      userRepo.credit(userId, -tpl.price);
    }
    // VULNERABILITY (A03): `message` is stored raw and later rendered without
    // escaping -> stored XSS against the recipient AND the admin dashboard.
    return giftCardRepo.createCard({
      catalog_id: tpl.id,
      owner_id: userId,
      code: makeCode(tpl.brand),
      pin: String(crypto.randomInt(1000, 9999)),
      message,
      value: tpl.value,
    });
  },

  // VULNERABILITY (API1 / race condition): check-then-act with an artificial
  // delay between the redeemed check and the update. Concurrent requests all
  // pass the check and all get credited -> double / N-times spend of one code.
  async redeem(userId, code) {
    const card = giftCardRepo.findByCode(code);
    if (!card) {
      const e = new Error('invalid code');
      e.status = 404;
      throw e;
    }
    if (card.redeemed) {
      const e = new Error('card already redeemed');
      e.status = 409;
      throw e;
    }
    await sleep(300); // TOCTOU window
    giftCardRepo.markRedeemed(card.id);
    const credited = userRepo.credit(userId, card.value);
    return { credited: card.value, new_balance: credited.balance, card_id: card.id };
  },

  transfer(userId, cardId, recipientIdentifier) {
    const card = giftCardRepo.findById(cardId);
    if (!card) {
      const e = new Error('card not found');
      e.status = 404;
      throw e;
    }
    const recipient =
      userRepo.findByUsername(recipientIdentifier) || userRepo.findByEmail(recipientIdentifier);
    if (!recipient) {
      const e = new Error('recipient not found');
      e.status = 404;
      throw e;
    }
    // NOTE: ownership of the card is only loosely verified — another BOLA-adjacent flaw.
    return giftCardRepo.transfer(cardId, recipient.id);
  },

  // VULNERABILITY (API1 / IDOR / BOLA): no ownership check — any authenticated
  // user can read any card's full details including code and PIN.
  getCard(id) {
    const card = giftCardRepo.findById(id);
    if (!card) {
      const e = new Error('card not found');
      e.status = 404;
      throw e;
    }
    return card;
  },

  search(term) {
    return giftCardRepo.searchRaw(term == null ? '' : String(term));
  },
};

module.exports = giftCardService;
