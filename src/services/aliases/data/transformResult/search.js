const { map, compose } = require('ramda');

const { Alias, List } = require('../../../../types');

const transformResult = require('./get');

/** transformResults :: Alias a ~> DbResponse[] -> List a */
const transformResults = result =>
  compose(
    List,
    map(
      compose(
        Alias,
        transformResult
      )
    )
  )(result);

module.exports = transformResults;
