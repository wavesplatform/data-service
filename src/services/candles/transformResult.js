const Maybe = require('folktale/maybe');

const { Candle, List } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults :: RawCandlesInfo[] -> List Candle */
const transformResults = transformCandleInfo => (result) =>
  compose(
    List,
    map(map(Candle)),
    map(map(transformCandleInfo))
  )(result);

module.exports = transformResults;
