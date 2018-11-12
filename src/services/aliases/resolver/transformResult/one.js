const { Alias } = require('../../../../types');

const aliasOrNull = maybeAlias =>
  maybeAlias.matchWith({
    Just: ({ value }) => Alias(value),
    Nothing: () => null,
  });

/** transformResults :: Maybe RawAliasInfo -> Alias | null */
const transformResults = aliasOrNull;

module.exports = transformResults;
