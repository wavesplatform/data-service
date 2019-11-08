import {
  AppError,
  ErrorMetaInfo,
  InitError,
  DbError,
  ValidationError,
  ResolverError,
  Timeout,
} from './AppError';
import { toAppError } from './factories';

export * from './AppError';
export * from './factories';

export const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error';
export const DEFAULT_TIMEOUT_OCCURRED_MESSAGE = 'A Timeout Occurred';
export const DEFAULT_NOT_FOUND_MESSAGE = 'Not Found';

export function addMeta(meta: ErrorMetaInfo): (e: InitError) => InitError;
export function addMeta(meta: ErrorMetaInfo): (e: DbError) => DbError;
export function addMeta(
  meta: ErrorMetaInfo
): (e: ValidationError) => ValidationError;
export function addMeta(
  meta: ErrorMetaInfo
): (e: ResolverError) => ResolverError;
export function addMeta(meta: ErrorMetaInfo): (e: Timeout) => Timeout;
export function addMeta(meta: ErrorMetaInfo) {
  return (e: AppError) => toAppError(e.type)(meta, e.error) as any;
}
