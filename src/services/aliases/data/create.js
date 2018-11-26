const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../errorHandling');

const {
  get: transformGet,
  search: transformSearch,
} = require('./transformResult');

module.exports = ({ pg, sql }) => {
  /** aliases.get :: Alias -> Task (Maybe Result) AppError.Db */
  const get = alias =>
    pg
      .oneOrNone(sql.get(alias))
      .map(Maybe.fromNullable)
      .map(map(transformGet))
      .mapRejected(toDbError({ request: 'aliases', params: alias }));

  /** aliases.mget :: (address, showBroken) -> Task (Maybe List)[] AppError.Db */
  const mget = ({ address, showBroken }) =>
    pg
      .any(sql.mget({ address, showBroken }))
      .map(map(transformSearch))
      .map(map(Maybe.fromNullable))
      .mapRejected(
        toDbError({ request: 'aliases', params: { address, showBroken } })
      );

  return {
    get,
    mget,
  };
};
