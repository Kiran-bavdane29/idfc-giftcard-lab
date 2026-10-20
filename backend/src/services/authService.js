const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userRepo = require('../repositories/userRepository');

function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

function publicUser(u) {
  return { id: u.id, username: u.username, email: u.email, role: u.role, balance: u.balance, points: u.points };
}

const authService = {
  register({ username, email, password }) {
    if (!username || !email || !password) {
      const e = new Error('username, email and password are required');
      e.status = 400;
      throw e;
    }
    if (userRepo.findByUsername(username) || userRepo.findByEmail(email)) {
      const e = new Error('user already exists');
      e.status = 409;
      throw e;
    }
    const user = userRepo.create({ username, email, password_hash: bcrypt.hashSync(password, 10) });
    return { token: signToken(user), user: publicUser(user) };
  },

  login({ username, password }) {
    // username or email accepted
    const user = userRepo.findByUsername(username) || userRepo.findByEmail(username);
    if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
      const e = new Error('invalid credentials');
      e.status = 401;
      throw e;
    }
    return { token: signToken(user), user: publicUser(user) };
  },
};

module.exports = authService;
