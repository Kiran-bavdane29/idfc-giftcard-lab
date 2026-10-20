const userRepo = require('../repositories/userRepository');

const userService = {
  // VULNERABILITY (API3 / BOPLA / mass assignment): every field in the request
  // body is written straight to the users table. A user can send
  // {"role":"admin"} or {"balance":999999} to escalate privileges / mint money.
  updateProfile(userId, body) {
    const { id, username, ...fields } = body; // username is 'protected', everything else isn't
    return userRepo.updateFields(userId, fields);
  },
};

module.exports = userService;
