const { List } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults :: t -> transformDbResponse -> DbResponse[] -> List t */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    List,
    map(
      compose(
        typeFactory,
        transformDbResponse
      )
    )
  );

module.exports = transformResults;
