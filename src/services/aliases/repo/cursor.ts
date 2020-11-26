import { Result, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { AliasesSearchRequest } from '../repo';
import { AliasInfo } from '../../../types';

export type Cursor = string;

export const serialize = <ResponseTransformed extends AliasInfo>(
  request: AliasesSearchRequest,
  response: ResponseTransformed
): string => Buffer.from(response.alias).toString('base64');

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  return ok<ValidationError, Cursor>(
    Buffer.from(cursor, 'base64').toString('utf8')
  );
};
