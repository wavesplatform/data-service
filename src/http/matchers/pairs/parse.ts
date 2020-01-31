import { Result, Ok as ok, Error as error } from 'folktale/result';
import { isNil } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { parseFilterValues } from '../../_common/filters';
import commonFilters from '../../_common/filters/filters';
import { HttpRequest } from '../../_common/types';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
} from '../../../services/pairs/repo/types';
import { parseArrayQuery, parsePairs } from '../../../utils/parsers';

export const get = ({
  params,
}: HttpRequest<['matcher', 'amountAsset', 'priceAsset']>): Result<
  ParseError,
  PairsGetRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(params.matcher)) {
    return error(new ParseError(new Error('Matcher is not set')));
  }
  if (params.amountAsset && params.priceAsset) {
    return ok({
      matcher: params.matcher,
      pair: {
        amountAsset: params.amountAsset,
        priceAsset: params.priceAsset,
      },
    });
  } else {
    return error(
      new ParseError(new Error('AmountAssetId or PriceAssetId are not set'))
    );
  }
};

export const mgetOrSearch = ({
  params,
  query,
}: HttpRequest<['matcher']>): Result<
  ParseError,
  PairsMgetRequest | PairsSearchRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    pairs: parsePairs,
    match_exactly: parseArrayQuery,
    search_by_asset: commonFilters.query,
    search_by_assets: parseArrayQuery,
  })(query).chain(fValues => {
    if (Array.isArray(fValues.pairs)) {
      return ok({ pairs: fValues.pairs, matcher: params.matcher });
    } else {
      if (fValues.search_by_asset || fValues.search_by_assets) {
        return ok({
          matcher: params.matcher,
          sort: fValues.sort,
          limit: fValues.limit,
          match_exactly: fValues.match_exactly,
          search_by_asset: fValues.search_by_asset,
          search_by_assets: fValues.search_by_assets,
        });
      } else {
        return error(
          new ParseError(new Error('There are not any search params'))
        );
      }
    }
  });
};
