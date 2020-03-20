import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ParseError } from '../../errorHandling';
import {
  AssetsServiceGetRequest,
  AssetsServiceMgetRequest,
  AssetsServiceSearchRequest,
} from '../../services/assets';
import { parseFilterValues, withDefaults } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import {
  SearchByTicker,
  FullTextSearch,
} from '../../services/assets/repo/types';
import { ParsedFilterValues } from '../_common/filters/types';

const mgetOrSearchParser = parseFilterValues({
  ticker: commonFilters.query,
  search: commonFilters.query,
});

type ParserFnType = typeof mgetOrSearchParser;

const isMgetRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AssetsServiceMgetRequest =>
  typeof req.ids !== 'undefined' && Array.isArray(req.ids);

const isSearchByTickerRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is SearchByTicker => typeof req.ticker !== 'undefined';

const isFullTextSearchRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is FullTextSearch => typeof req.search !== 'undefined';

export const get = ({
  params,
}: HttpRequest<['id']>): Result<ParseError, AssetsServiceGetRequest> => {
  if (params) {
    return ok({ id: params.id });
  } else {
    return error(new ParseError(new Error('AssetId is required')));
  }
};

export const mgetOrSearch = ({
  query,
}: HttpRequest): Result<
  ParseError,
  AssetsServiceMgetRequest | AssetsServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return mgetOrSearchParser(query).chain(fValues => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      const fValuesWithDefaults = withDefaults(fValues);

      if (isSearchByTickerRequest(fValuesWithDefaults)) {
        return ok(fValuesWithDefaults);
      } else if (isFullTextSearchRequest(fValuesWithDefaults)) {
        return ok(fValuesWithDefaults);
      } else {
        return error(
          new ParseError(new Error('There is neither ticker nor search query'))
        );
      }
    }
  });
};
