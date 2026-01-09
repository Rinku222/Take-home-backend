const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  hashPassword: async (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
  },

  comparePassword: async (plainPassword, hash) => {
    return bcrypt.compare(plainPassword, hash);
  }
};
