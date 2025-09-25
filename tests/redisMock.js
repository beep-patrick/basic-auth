let store = {};
module.exports = {
  hSet: async (hash, key, value) => {
    if (!store[hash]) store[hash] = {};
    store[hash][key] = value;
  },
  hGet: async (hash, key) => {
    return store[hash]?.[key] || null;
  },
  hGetAll: async (hash) => {
    return store[hash] || {};
  },
  __reset: () => { store = {}; }
};