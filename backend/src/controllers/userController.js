const userService = require('../services/userService');

// PATCH /users/profile — BOPLA / mass assignment.
// Try: {"role":"admin"} or {"balance":999999}
exports.updateProfile = (req, res, next) => {
  try {
    const u = userService.updateProfile(req.user.id, req.body);
    res.json({ id: u.id, username: u.username, email: u.email, role: u.role, balance: u.balance, points: u.points });
  } catch (e) {
    next(e);
  }
};
