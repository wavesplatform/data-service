import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { AssetsSearchRequest, AssetDbResponse } from './types';
import { assetId as assetIdRegExp } from '../../../utils/regex';

export type Cursor = string;

export const serialize = <Response extends AssetDbResponse>(
  request: AssetsSearchRequest,
  response: Response
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(response.asset_id.toString()).toString('base64');

export const deserialize = (cursor: string): Result<ValidationError, Cursor> => {
  let assetId = Buffer.from(cursor, 'base64').toString('utf-8');
  if (assetIdRegExp.test(assetId)) {
    return ok<ValidationError, Cursor>(Buffer.from(cursor, 'base64').toString('utf-8'));
  } else {
    return error<ValidationError, Cursor>(
      new ValidationError('Cursor deserialization is failed', {
        cursor: 'Invalid data',
      })
    );
  }
};
