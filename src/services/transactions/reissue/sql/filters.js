const { where, whereIn } = require('../../../../utils/db/knex');

const id = where('id');
const ids = whereIn('id');

module.exports = {
  id,
  ids,
};
