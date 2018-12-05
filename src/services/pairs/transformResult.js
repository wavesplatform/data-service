const { compose, pick } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

module.exports = compose(
  pick(['firstPrice', 'lastPrice', 'volume', 'volumeWaves']),
  renameKeys({
    first_price: 'firstPrice',
    last_price: 'lastPrice',
    volume_waves: 'volumeWaves',
  })
);
