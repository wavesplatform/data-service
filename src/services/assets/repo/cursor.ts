import { Result, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { AssetsSearchRequest, AssetDbResponse } from './types';

export type Cursor = string;

export const serialize = <Response extends AssetDbResponse>(
  request: AssetsSearchRequest,
  response: Response
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(response.asset_id.toString()).toString('base64');

export const deserialize = (cursor: string): Result<ValidationError, Cursor> =>
  ok<ValidationError, Cursor>(Buffer.from(cursor, 'base64').toString('utf-8'));
