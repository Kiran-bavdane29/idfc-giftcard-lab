const authService = require('../services/authService');
const userRepo = require('../repositories/userRepository');

exports.register = (req, res, next) => {
  try {
    res.status(201).json(authService.register(req.body));
  } catch (e) {
    next(e);
  }
};

exports.login = (req, res, next) => {
  try {
    res.json(authService.login(req.body));
  } catch (e) {
    next(e);
  }
};

exports.me = (req, res) => {
  const u = userRepo.findById(req.user.id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  res.json({ id: u.id, username: u.username, email: u.email, role: u.role, balance: u.balance, points: u.points });
};
