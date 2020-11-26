import { Result, Ok as ok, Error as error } from 'folktale/result';
import { isNil, mergeAll } from 'ramda';
import { ParseError } from '../../../errorHandling';
import {
  WithMatcher,
  WithSortOrder,
  WithLimit,
} from '../../../services/_common';
import {
  PairsGetRequest,
  PairsMgetRequest,
} from '../../../services/pairs/repo/types';
import { PairsServiceSearchRequest } from '../../../services/pairs';
import { withDefaults } from '../../_common/filters';
import { HttpRequest } from '../../_common/types';
import {
  mgetOrSearchParser,
  isMgetRequest,
  isSearchByAssetRequest,
  isSearchByAssetsRequest,
  isSearchCommonRequest,
} from '../../pairs/utils';

export const get = ({
  params,
}: HttpRequest<['matcher', 'amountAsset', 'priceAsset']>): Result<
  ParseError,
  PairsGetRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
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
  PairsMgetRequest | PairsServiceSearchRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return mgetOrSearchParser(query).chain(fValues => {
    if (isMgetRequest(fValues)) {
      return ok({
        pairs: fValues.pairs,
        matcher: params.matcher,
      });
    } else {
      const fValuesWithDefaults = mergeAll<
        PairsServiceSearchRequest & WithMatcher & WithSortOrder & WithLimit
      >([
        withDefaults(fValues),
        {
          matcher: params.matcher,
        },
      ]);

      if (isSearchCommonRequest(fValuesWithDefaults)) {
        if (isSearchByAssetRequest(fValuesWithDefaults)) {
          return ok(fValuesWithDefaults);
        } else if (isSearchByAssetsRequest(fValuesWithDefaults)) {
          return ok(fValuesWithDefaults);
        } else {
          return ok(fValuesWithDefaults);
        }
      } else {
        return error(
          new ParseError(new Error('Invalid request data'), fValuesWithDefaults)
        );
      }
    }
  });
};
