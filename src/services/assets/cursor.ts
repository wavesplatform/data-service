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
  request.after === undefined || response.data === null
    ? undefined
    : Buffer.from(request.after).toString('base64');

export const decode = (cursor: string): Result<ValidationError, Cursor> => {
  const assetId = Buffer.from(cursor, 'base64').toString('utf8');
  return ok<ValidationError, Cursor>({ assetId });
};
