const { list, fromMaybe } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults t :: t -> transformDbResponse -> (Maybe DbResponse)[] -> List t */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    list,
    map(
      compose(
        fromMaybe(typeFactory),
        map(transformDbResponse)
      )
    )
  );

module.exports = transformResults;
