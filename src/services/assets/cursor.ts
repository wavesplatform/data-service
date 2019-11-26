import { Result, Ok as ok } from 'folktale/result';
import { Asset } from '../../types';
import { ValidationError } from '../../errorHandling';
import { AssetsSearchRequest } from './types';

export type Cursor = string;

export const serialize = <ResponseTransformed extends Asset>(
  request: AssetsSearchRequest,
  response: ResponseTransformed
): string | undefined =>
  response.data === null ? undefined : response.data.id;

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  return ok<ValidationError, Cursor>(cursor);
};
