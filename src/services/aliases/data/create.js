const { map } = require('ramda');
const Maybe = require('folktale/maybe');

const { toDbError } = require('../../../errorHandling');

const transformResults = require('./transformResults');

module.exports = ({ pg, sql }) => {
  /** aliases.get :: Alias -> Task (Maybe Result) AppError.Db */
  const get = alias => 
    pg
      .oneOrNone(sql.get(alias))
      .map(Maybe.fromNullable)
      .map(map(transformResults))
      .mapRejected(toDbError({ request: 'aliases', params: alias }));

  /** aliases.mget :: (address, showBroken) -> Task (Maybe Result)[] AppError.Db */
  const mget = ({ address, showBroken }) =>
    pg
      .any(sql.mget({address, showBroken}))
      .map(map(transformResults))
      .map(map(Maybe.fromNullable))
      .mapRejected(toDbError({ request: 'aliases', params: { address, showBroken } }));

  return {
    get,
    mget,
  };
};
