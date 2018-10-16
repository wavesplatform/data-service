const { matchRequestsResults } = require('../../../../utils/db/index');

const { toDbError } = require('../../../../errorHandling');

module.exports = ({ matchRequestResult, name, sql }) => pg => ids =>
  pg
    .any(sql(ids))
    .map(matchRequestsResults(matchRequestResult, ids))
    .mapRejected(toDbError({ request: name, params: ids }));
