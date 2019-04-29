import {
  AppError,
  DbError,
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

export const toDbError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  DbError
> = toAppError('Db') as any;

export const toValidationError: CurriedFunction2<
  ErrorMetaInfo,
  Error,
  ValidationError
> = toAppError('Db') as any;
