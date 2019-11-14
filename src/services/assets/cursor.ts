import { Result, Ok as ok } from 'folktale/result';
import { Asset } from '../../types';
import { ValidationError } from '../../errorHandling';
import { AssetsSearchRequest } from './types';

export type Cursor = {
  assetId: String;
};

export const encode = <ResponseTransformed extends Asset>(
  request: AssetsSearchRequest,
  response: ResponseTransformed
): string | undefined =>
  response.data === null ? undefined : response.data.id;

export const decode = (cursor: string): Result<ValidationError, Cursor> => {
  return ok<ValidationError, Cursor>({ assetId: cursor });
};
