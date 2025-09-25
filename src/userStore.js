// src/userStore.js
const redisClient = require('./redisClient');

async function saveUser(user) {
  await redisClient.hSet('users', user.username, JSON.stringify(user));
}

async function getUser(username) {
  const data = await redisClient.hGet('users', username);
  return data ? JSON.parse(data) : null;
}

async function getAllUsers() {
  const users = await redisClient.hGetAll('users');
  return Object.values(users).map(u => JSON.parse(u));
}

module.exports = {
  saveUser,
  getUser,
  getAllUsers,
};
