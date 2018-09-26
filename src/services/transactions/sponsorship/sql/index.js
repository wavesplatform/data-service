const { pipe } = require('ramda');

const F = require('./filters');
const { select } = require('./query');

module.exports = {
  get: id =>
    pipe(
      F.id(id),
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      String
    )(select),
};
