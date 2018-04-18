module.exports = {
  assets: async ids => Promise.resolve({ assets: ids.map(id => ({ id })) }),
};
