/** transformResults :: Maybe tx -> tx | null */
const transformResults = maybeTx =>
  maybeTx.matchWith({
    Just: ({ value }) => value,
    Nothing: () => null,
  });

module.exports = transformResults;
