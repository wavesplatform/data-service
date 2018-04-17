module.exports = {
  getAssets: async ids => Promise.resolve({ assets: ids.map(id => ({ id })) }),
};
