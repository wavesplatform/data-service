import { AppError, ErrorMetaInfo } from './AppError';
import { toAppError } from './factories';

export * from './AppError';
export * from './factories';

export const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
export const DEFAULT_TIMEOUT_OCCURRED_MESSAGE = 'A Timeout Occurred';
export const DEFAULT_NOT_FOUND_MESSAGE = 'Not Found';

export function addMeta<T extends AppError>(meta: ErrorMetaInfo): (e: T) => T;
export function addMeta(meta: ErrorMetaInfo): (e: AppError) => AppError {
  return (e: AppError) => toAppError(e.type)(meta, e.error);
}
