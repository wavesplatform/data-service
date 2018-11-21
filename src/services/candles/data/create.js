const { toDbError } = require('../../../errorHandling');

module.exports = ({ pg, sql }) => {
  /** assets.mget :: Candle[] -> Task Result[] AppError.Db */
  const search = filters =>
    pg
      .any(sql(filters))
      .mapRejected(toDbError({ request: 'candles', params: filters }));

  return {
    search
  };
};
