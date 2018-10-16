const Maybe = require('folktale/maybe');
const { toDbError } = require('../../../../errorHandling');

module.exports = ({ name, sql }) => pg => id =>
  pg
    .oneOrNone(sql(id))
    .map(Maybe.fromNullable)
    .mapRejected(toDbError({ request: name, params: id }));
