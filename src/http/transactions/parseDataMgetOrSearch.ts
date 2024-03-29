import { Result, Error as error, Ok as ok } from 'folktale/result';
import { isNil } from 'ramda';
import { BigNumber } from '@waves/data-entities';
import { ParseError } from '../../errorHandling';
import { DataTxsServiceSearchRequest } from '../../services/transactions/data/types';
import { DataEntryValue } from '../../services/transactions/data/repo/types';
import { DataEntryType, ServiceMgetRequest } from '../../types';
import { parseFilterValues, withDefaults } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { Parser } from '../_common/filters/types';
import { HttpRequest } from '../_common/types';
import { parseBool } from '../../utils/parsers/parseBool';
import { isMgetRequest } from './_common';

const isDataEntryType = (raw: unknown): raw is DataEntryType =>
  [
    DataEntryType.Binary,
    DataEntryType.Boolean,
    DataEntryType.Integer,
    DataEntryType.String,
  ].includes(raw as DataEntryType);

function parseValue(
  type: DataEntryType.Boolean,
  vs: string
): Result<ParseError, boolean>;
function parseValue(
  type: DataEntryType.Integer,
  vs: string
): Result<ParseError, BigNumber>;
function parseValue(
  type: DataEntryType.Binary | DataEntryType.String,
  vs: string
): Result<ParseError, string>;
function parseValue(
  type: DataEntryType | undefined,
  vu: undefined
): Result<ParseError, undefined>;
function parseValue(
  type: DataEntryType | undefined,
  vu: string | undefined
): Result<ParseError, DataEntryValue>;

function parseValue(
  type?: DataEntryType,
  value?: string
): Result<ParseError, DataEntryValue | undefined> {
  if (type === undefined || value === undefined) return ok(undefined);
  if (type === DataEntryType.Boolean) return parseBool(value);
  else if (type === DataEntryType.Integer) {
    try {
      const v = new BigNumber(value);
      if (v.isNaN()) {
        throw new Error('Provided value is not a number');
      } else {
        return ok(v);
      }
    } catch (e) {
      return error(new ParseError(e));
    }
  } else return ok(value);
}

const parseDataEntryType: Parser<DataEntryType | undefined> = (raw) => {
  if (isNil(raw)) return ok(undefined);

  if (isDataEntryType(raw)) {
    return ok(raw);
  } else {
    return error(new ParseError(new Error('Invalid type param value')));
  }
};

export const parseDataMgetOrSearch = ({
  query,
}: HttpRequest<string[]>): Result<
  ParseError,
  ServiceMgetRequest | DataTxsServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    key: commonFilters.query,
    type: parseDataEntryType,
    value: commonFilters.query,
  })(query).chain((fValues) => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      const fValuesWithDefaults = withDefaults(fValues);
      if (
        !isNil(fValuesWithDefaults.value) &&
        isNil(fValuesWithDefaults.type)
      ) {
        return error(
          new ParseError(new Error('Type param has to be set with value param'))
        );
      }
      return parseValue(
        fValuesWithDefaults.type,
        fValuesWithDefaults.value
      ).map((value) => ({
        ...fValuesWithDefaults,
        ...(value ? { value } : {}),
      }));
    }
  });
};
