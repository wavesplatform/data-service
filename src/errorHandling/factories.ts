import {
  AppError,
  DbError,
  InitError,
  ResolverError,
  ValidationError,
  ErrorType,
  ErrorMetaInfo,
} from './AppError';
import { curryN, CurriedFunction2, CurriedFunction3 } from 'ramda';

export const toAppError: CurriedFunction3<
  ErrorType,
  ErrorMetaInfo,
  Error,
  AppError
> = curryN(3, (type: ErrorType, meta: ErrorMetaInfo, err: Error) =>
  AppError[type](err, meta)
);

export const toInitError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  InitError
> = toAppError('Init') as any;

export const toResolverError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  ResolverError
> = toAppError('Resolver') as any;

export const toDbError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  DbError
> = toAppError('Db') as any;

export const toValidationError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  ValidationError
> = toAppError('Validation') as any;
