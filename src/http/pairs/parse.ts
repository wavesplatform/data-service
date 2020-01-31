import { Result, Error as error } from 'folktale/result';
import { compose, defaultTo, isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
} from '../../services/pairs/repo/types';
import { parseArrayQuery, parseBool, parsePairs } from '../../utils/parsers';

import { loadConfig } from '../../loadConfig';
const options = loadConfig();

const matcherParser: Parser<string | undefined> = compose(
  commonFilters.query,
  defaultTo(options.matcher.defaultMatcherAddress)
);

export const get = ({
  params,
  query,
}: HttpRequest<['amountAsset', 'priceAsset']>): Result<
  ParseError,
  PairsGetRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    matcher: matcherParser,
  })(query).map(fValues => {
    if (isNil(fValues.matcher)) {
      throw new ParseError(new Error('matcher is not set'));
    }

    return {
      matcher: fValues.matcher,
      pair: {
        amountAsset: params.amountAsset,
        priceAsset: params.priceAsset,
      },
    };
  });
};

export const mgetOrSearch = ({
  query,
}: HttpRequest): Result<ParseError, PairsMgetRequest | PairsSearchRequest> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    matcher: matcherParser,
    pairs: parsePairs,
    match_exactly: parseBool,
    search_by_asset: commonFilters.query,
    search_by_assets: parseArrayQuery,
  })(query).map(fValues => {
    if (isNil(fValues.matcher)) {
      throw new ParseError(new Error('matcher is not set'));
    }

    if (Array.isArray(fValues.pairs)) {
      return { pairs: fValues.pairs, matcher: fValues.matcher };
    } else {
      if (fValues.search_by_asset || fValues.search_by_assets) {
        return {
          matcher: fValues.matcher,
          sort: fValues.sort,
          limit: fValues.limit,
          match_exactly: fValues.match_exactly,
          search_by_asset: fValues.search_by_asset,
          search_by_assets: fValues.search_by_assets,
        };
      } else {
        throw new ParseError(new Error('There are not any search params'));
      }
    }
  });
};
