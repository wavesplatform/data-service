const { list } = require('../../../../types');
const { map, compose } = require('ramda');

/** transformResults :: t -> transformDbResponse -> DbResponse[] -> List t */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    list,
    map(
      compose(
        typeFactory,
        transformDbResponse
      )
    )
  );

module.exports = transformResults;
