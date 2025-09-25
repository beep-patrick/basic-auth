const redisClient = require('../redisClient');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

async function saveUser(user) {
  // Hash the password before storing. 
  // For best practices advice see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS); 
  await redisClient.hSet('users', user.username, JSON.stringify({
    username: user.username,
    password: hashedPassword
  }));
}

async function verifyUser(username, password) {
  const data = await redisClient.hGet('users', username);
  if (!data) return false;
  const user = JSON.parse(data);
  return await bcrypt.compare(password, user.password);
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
