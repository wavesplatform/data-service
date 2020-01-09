import { Result, Ok as ok } from 'folktale/result';
import { Asset } from '@waves/data-entities';
import { ValidationError } from '../../../errorHandling';
import { AssetsSearchRequest } from './types';

export type Cursor = string;

export const serialize = <ResponseTransformed extends Asset>(
  request: AssetsSearchRequest,
  response: ResponseTransformed
): string => Buffer.from(response.id).toString('base64');

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  return ok<ValidationError, Cursor>(
    Buffer.from(cursor, 'base64').toString('utf8')
  );
};
