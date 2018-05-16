const { renameKeys } = require('ramda-adjunct');
const { compose, reject, isNil } = require('ramda');

/** transformPairInfo:: RawPairInfo -> PairInfo */
const transformPairInfo = compose(
  renameKeys({
    last_price: 'lastPrice',
    first_price: 'firstPrice',
  }),
  reject(isNil)
);

module.exports = { transformPairInfo };
