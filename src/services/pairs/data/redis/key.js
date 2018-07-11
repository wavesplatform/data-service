module.exports = pair => {
  try {
    return `pair:${pair.amountAsset}/${pair.priceAsset}`;
  } catch (err) {
    throw new Error(`Error creating redis key for pair ${pair}`);
  }
};
