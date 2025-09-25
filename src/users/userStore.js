const redisClient = require('../redisClient');
const argon2 = require('argon2');
const Joi = require('joi');

async function saveUser(username, password) {
  const userSchema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(12)  // Passwords shorter than 12 characters are easy to brute-force. See https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#password-storage
      .max(256) // Prevent extremely long passwords that could be used in denial-of-service attacks
      .required()
  });

  const { error } = userSchema.validate({ username, password });
  if (error) {
    return { error, newUser: null };
  }

  // Enforce unique usernames
  const existing = await redisClient.hGet('users', username);
  if (existing) {
    return {
      error: { details: [
        {
          message: 'Username already exists',
          path: ['username'],
          type: 'username.unique',
          context: { value: username }
        }
      ]}, newUser: null
    };
  }

  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
  await redisClient.hSet('users', username, JSON.stringify({
    username,
    password: hashedPassword
  }));
  return { error: null, newUser: { username } };
}

async function verifyUser(username, password) {
  const data = await redisClient.hGet('users', username);
  if (!data) return false;
  const user = JSON.parse(data);
  return await argon2.verify(user.password, password);
}

async function getUser(username) {
  const data = await redisClient.hGet('users', username);
  if (!data) return null;
  const { username: name } = JSON.parse(data);
  return { username: name };
}

async function getAllUsers() {
  const users = await redisClient.hGetAll('users');
  return Object.values(users).map(u => {
    const { username } = JSON.parse(u);
    return { username };
  });
}

module.exports = {
  saveUser,
  getUser,
  getAllUsers,
  verifyUser,
};
