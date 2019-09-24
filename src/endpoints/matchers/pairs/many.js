const { has, map, compose } = require('ramda');
const Maybe = require('folktale/maybe');

const { captureErrors } = require('../../../utils/captureErrors');
const { handleError } = require('../../../utils/handleError');

const { select } = require('../../utils/selectors');
const { parseArrayQuery } = require('../../utils/parseArrayQuery');
const { parseBool } = require('../../utils/parseBool');

const { parsePairs } = require('../parsePairs');

const {
  parseFilterValues,
  limit,
  query: queryFilter,
} = require('../../_common/filters');

const mgetFilterName = 'pairs';

const filterParsers = {
  pairs: compose(
    m => m.getOrElse(null),
    map(parsePairs),
    Maybe.fromNullable,
    parseArrayQuery
  ),
  search_by_asset: queryFilter,
  search_by_assets: parseArrayQuery,
  match_exactly: compose(
    m => m.getOrElse(undefined),
    map(map(parseBool)),
    Maybe.fromNullable,
    parseArrayQuery
  ),
  limit,
};

/**
 * Endpoint
 * @name /matchers/:matcher/pairs?pairs[]‌="{asset_id_1}/{asset_id_2}"&pairs[]="{asset_id_1}/{asset_id_2}" ...other params
 */
const pairsManyEndpoint = service => async ctx => {
  const { fromParams, query } = select(ctx);
  const [matcher] = fromParams(['matcher']);
  const fValues = parseFilterValues(filterParsers)(query);

  ctx.eventBus.emit('ENDPOINT_HIT', {
    url: ctx.originalUrl,
    resolver: '/matchers/:matcher/pairs',
    query,
  });

  let results;
  if (has(mgetFilterName, fValues)) {
    // mget hit
    if (service.mget) {
      results = await service
        .mget({ pairs: fValues.pairs, matcher })
        .run()
        .promise();
    } else {
      ctx.status = 404;
      return;
    }
  } else {
    // search hit
    if (service.search) {
      results = await service
        .search({ matcher, ...fValues })
        .run()
        .promise();
    } else {
      ctx.status = 404;
      return;
    }
  }

  ctx.eventBus.emit('ENDPOINT_RESOLVED', {
    value: results,
  });

  if (results) {
    ctx.state.returnValue = results;
  } else {
    ctx.status = 404;
  }
};

module.exports = service =>
  captureErrors(handleError)(pairsManyEndpoint(service));
