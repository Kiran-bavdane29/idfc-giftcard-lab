const crypto = require('crypto');
const giftCardRepo = require('../repositories/giftCardRepository');
const userRepo = require('../repositories/userRepository');

const adminService = {
  // VULNERABILITY (API4 / unrestricted resource consumption + missing
  // validation): accepts arrays of users, arbitrary counts, and arbitrary
  // `value` overrides (including negative or huge values). No rate limit.
  massAssign(body) {
    const userIds = Array.isArray(body.user_ids)
      ? body.user_ids
      : body.user_id
      ? [body.user_id]
      : [];
    const count = Number(body.count || 1); // unbounded — set count=100000 to flood
    const tpl = giftCardRepo.findCatalog(body.catalog_id) || {};
    const created = [];

    for (const uid of userIds) {
      for (let i = 0; i < count; i++) {
        created.push(
          giftCardRepo.createCard({
            catalog_id: body.catalog_id || null,
            owner_id: uid, // never validated — can point at non-existent users
            code: `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            pin: String(crypto.randomInt(1000, 9999)),
            message: body.message || 'assigned by admin',
            value: body.value !== undefined ? Number(body.value) : tpl.value || 0,
          })
        );
      }
    }
    return { created_count: created.length, cards: created };
  },
};

module.exports = adminService;
