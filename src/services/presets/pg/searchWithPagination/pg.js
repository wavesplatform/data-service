const { toDbError } = require('../../../../errorHandling');

// /** search :: deps -> pg -> filters -> Task Result[] AppError.Db */
module.exports = ({ name, sql }) => pg => filters => (
  require('fs').writeFileSync('q.sql', sql(filters)),
  pg
    .any(sql(filters))
    .mapRejected(toDbError({ request: name, params: filters }))
);
