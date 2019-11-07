import { cond, propEq } from 'ramda';
import { AppError, ErrorMetaInfo } from './AppError';
import {
  toInitError,
  toTimeout,
  toResolverError,
  toValidationError,
  toDbError,
} from './factories';

export * from './AppError';
export * from './factories';

export const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
export const DEFAULT_TIMEOUT_OCCURRED_MESSAGE = 'A Timeout Occurred';
export const DEFAULT_NOT_FOUND_MESSAGE = 'Not Found';

export const addMeta = <T extends AppError>(meta: ErrorMetaInfo) => (e: T): T =>
  cond([
    [propEq('type', 'Init'), err => toInitError(meta, err.error)],
    [propEq('type', 'Db'), err => toDbError(meta, err.error)],
    [propEq('type', 'Validation'), err => toValidationError(meta, err.error)],
    [propEq('type', 'Resolver'), err => toResolverError(meta, err.error)],
    [propEq('type', 'Timeout'), err => toTimeout(meta, err.error)],
  ])(e);
