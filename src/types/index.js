const { curry } = require('ramda');

/** fromMaybe :: Type -> Maybe a -> (Type a | Type Nil) */
const fromMaybe = curry((Type, mb) =>
  mb.matchWith({
    Just: ({ value }) => Type(value),
    Nothing: () => Type(),
  })
);

module.exports = {
  Asset: require('./Asset'),
  List: require('./List'),
  Pair: require('./Pair'),
  Transaction: require('./Transaction'),
  fromMaybe,
};
