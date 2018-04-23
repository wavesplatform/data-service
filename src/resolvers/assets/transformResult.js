const { renameKeys } = require('ramda-adjunct');
const {
  compose,
  map,
  reject,
  isNil,
  assoc,
  cond,
  T,
  identity,
} = require('ramda');

const transformAsset = compose(
  assoc('__type', 'asset'),
  renameKeys({
    asset_id: 'id',
    asset_name: 'name',
    issue_height: 'height',
    issue_timestamp: 'timestamp',
    total_quantity: 'quantity',
    decimals: 'precision',
  }),
  reject(isNil)
);

module.exports = map(cond([[isNil, identity], [T, transformAsset]]));
