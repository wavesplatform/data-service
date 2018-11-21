const Maybe = require('folktale/maybe');

const { List } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults :: t -> -> transformDbResponse -> DbResponse[] -> List Maybe t */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    List,
    map(m => m.getOrElse(null)),
    map(Maybe.fromNullable),
    map(
      compose(
        typeFactory,
        transformDbResponse
      )
    )
  );

module.exports = transformResults;
