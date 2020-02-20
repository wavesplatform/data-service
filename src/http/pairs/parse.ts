import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose, defaultTo, isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { parseFilterValues } from '../_common/filters';
import { Parser } from '../_common/filters/types';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import { WithMatcher } from '../../services/_common';
import {
  PairsGetRequest,
  PairsMgetRequest,
  SearchByAssetRequest,
  SearchCommonRequest,
  SearchByAssetsRequest,
} from '../../services/pairs/repo/types';
import { PairsServiceSearchRequest } from '../../services/pairs';
import { parseArrayQuery, parseBool, parsePairs } from '../../utils/parsers';
import { ParseArrayQuery } from '../../utils/parsers/parseArrayQuery';

import { loadConfig } from '../../loadConfig';

const options = loadConfig();

const matcherParser: Parser<string> = compose<
  string | undefined,
  string,
  Result<ParseError, string>
>(
  commonFilters.query as Parser<string>, // raw always will be defined
  defaultTo(options.matcher.defaultMatcherAddress)
);

const withMatcher = (req: any): req is WithMatcher =>
  'matcher' in req && typeof req.matcher !== 'undefined';

export const isMgetRequest = (req: any): req is PairsMgetRequest =>
  'pairs' in req && Array.isArray(req.pairs) && withMatcher(req);

const isSearchCommonRequest = (req: any): req is SearchCommonRequest =>
  'matcher' in req && typeof req.matcher === 'string';

const isSearchByAssetRequest = (req: any): req is SearchByAssetRequest =>
  'search_by_asset' in req && typeof req.search_by_asset === 'string';

const isSearchByAssetsRequest = (req: any): req is SearchByAssetsRequest =>
  'search_by_assets' in req && typeof req.search_by_assets === 'string';

type ParseMatchExactly = Parser<boolean[] | undefined>;

const parseMatchExactly: ParseMatchExactly = (matchExactlyRaw?: string) =>
  isNil(matchExactlyRaw)
    ? ok(undefined)
    : parseArrayQuery(matchExactlyRaw).chain(ss =>
        typeof ss === 'undefined'
          ? ok(undefined)
          : ss.map(parseBool).reduceRight((acc, cur) => {
              return acc.chain(a =>
                cur.matchWith({
                  Ok: ({ value }) =>
                    typeof value === 'undefined' ? ok(a) : ok([...a, value]),
                  Error: ({ value }) => error(value),
                })
              );
            }, ok([] as boolean[]))
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
  })(query).chain(fValues => {
    return ok({
      matcher: fValues.matcher,
      pair: {
        amountAsset: params.amountAsset,
        priceAsset: params.priceAsset,
      },
    });
  });
};

export const mgetOrSearch = ({
  query,
}: HttpRequest): Result<
  ParseError,
  PairsMgetRequest | PairsServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    matcher: matcherParser,
    pairs: parsePairs,
    match_exactly: parseMatchExactly,
    search_by_asset: commonFilters.query,
    search_by_assets: parseArrayQuery as ParseArrayQuery, // merge function type and overloads 
  })(query).chain(fValues => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      if (isSearchCommonRequest(fValues)) {
        if (isSearchByAssetRequest(fValues)) {
          return ok(fValues);
        } else if (isSearchByAssetsRequest(fValues)) {
          return ok(fValues);
        } else {
          return ok(fValues);
        }
      } else {
        return error(new ParseError(new Error('Invalid request data')));
      }
    }
  });
};
