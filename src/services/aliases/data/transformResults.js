const Maybe = require('folktale/maybe');
const { map, compose } = require('ramda');

const { List } = require('../../../types');

const transformResult = require('./transformResult');

/** transformResults :: t -> -> transformDbResponse -> DbResponse[] -> List Maybe t */
const transformResults = typeFactory => result =>
  compose(
    List,
    map(m => m.getOrElse(null)),
    map(Maybe.fromNullable),
    map(
      compose(
        typeFactory,
        transformResult
      )
    )
  )(result);

module.exports = transformResults;
