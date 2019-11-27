import { Result, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../errorHandling';
import { AssetsSearchRequest, AssetDbResponse } from './types';

export type Cursor = string;

export const serialize = <Response extends AssetDbResponse>(
  request: AssetsSearchRequest,
  response: Response
): string | undefined => (response === null ? undefined : response.asset_id);

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  return ok<ValidationError, Cursor>(cursor);
};
