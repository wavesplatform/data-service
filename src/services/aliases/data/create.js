const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../errorHandling');

module.exports = ({ pg, sql }) => {
  /** aliases.get :: Alias -> Task (Maybe Result) AppError.Db */
  const get = alias => 
    pg
      .oneOrNone(sql.one(alias))
      .map(Maybe.fromNullable)
      .mapRejected(toDbError({ request: 'aliases', params: alias }));

  /** aliases.mget :: (address, showBroken) -> Task (Maybe Result)[] AppError.Db */
  const mget = ({ address, showBroken }) =>
    pg
      .any(sql.mget({address, showBroken}))
      .map(map(Maybe.fromNullable))
      .mapRejected(toDbError({ request: 'aliases', params: { address, showBroken } }));

  return {
    get,
    mget,
  };
};
