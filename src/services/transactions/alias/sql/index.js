const { pipe } = require('ramda');

const F = require('./filters');
const { select, withFirstOnly } = require('./query');

module.exports = {
  get: id =>
    pipe(
      F.id(id),
      withFirstOnly,
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      withFirstOnly,
      String
    )(select),
};
