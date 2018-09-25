const { List } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults t :: t -> transformDbResponse ->(Maybe DbResponse)[] -> List t */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    List,
    map(m => m.getOrElse(null)),
    map(
      map(
        compose(
          typeFactory,
          transformDbResponse
        )
      )
    )
  );

module.exports = transformResults;
