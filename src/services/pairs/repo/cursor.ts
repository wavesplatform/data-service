import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { PairsSearchRequest } from './types';
import { PairResponse } from './transformResult';

export type Cursor = [string, string];

export const serialize = <ResponseTransformed extends PairResponse>(
  request: PairsSearchRequest,
  response: ResponseTransformed
): string =>
  Buffer.from(`${response.amountAssetId}:${response.priceAssetId}`).toString(
    'base64'
  );

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split(':');
  if (data.length === 2) {
    return ok<ValidationError, Cursor>(data as [string, string]);
  } else {
    return error(new ValidationError('Invalid cursor'));
  }
};
