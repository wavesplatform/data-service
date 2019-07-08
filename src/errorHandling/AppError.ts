import { Matchable } from 'folktale';
import * as joi from 'joi';

export type ErrorMetaInfo = Record<string, unknown>;

export type ErrorType = keyof AppErrorPattern<any>;

export type ErrorInfo = {
  readonly error: Error;
  readonly type: ErrorType;
};

export type ErrorInfoWithMeta = ErrorInfo & {
  readonly meta: ErrorMetaInfo;
};

export type ValidationErrorInfo = ErrorInfo & {
  readonly meta: joi.ValidationError;
};

export type AppErrorPattern<C> = {
  Db: (e: ErrorInfo | ErrorInfoWithMeta) => C;
  Resolver: (e: ErrorInfo | ErrorInfoWithMeta) => C;
  Validation: (e: ValidationErrorInfo) => C;
};

const ensureError = (e: Error | string): Error =>
  e instanceof Error ? e : new Error(e);

function createErrorInfo(type: ErrorType, error: Error): ErrorInfo;
function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta: ErrorMetaInfo
): ErrorInfoWithMeta;
function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta: joi.ValidationError
): ValidationErrorInfo;
function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta?: ErrorMetaInfo | joi.ValidationError
): ErrorInfo | ErrorInfoWithMeta | ValidationErrorInfo {
  if (typeof meta !== 'undefined') {
    return {
      error,
      type,
      meta,
    };
  } else
    return {
      error,
      type,
    };
}

export abstract class AppError implements Matchable {
  public abstract readonly type: ErrorInfo['type'];
  public abstract readonly error: ErrorInfo['error'];

  public abstract matchWith<C>(pattern: AppErrorPattern<C>): C;

  public static Db(error: Error | string, meta?: ErrorMetaInfo) {
    return new DbError(error, meta);
  }
  public static Resolver(error: Error | string, meta?: ErrorMetaInfo) {
    return new ResolverError(error, meta);
  }
  public static Validation(error: Error | string, meta: joi.ValidationError) {
    return new ValidationError(error, meta);
  }
}

export class ResolverError extends AppError implements ErrorInfo {
  public readonly type = 'Resolver';
  public readonly error: ErrorInfo['error'];
  public readonly meta?: ErrorInfoWithMeta['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Resolver(
      this.meta === undefined
        ? createErrorInfo(this.type, this.error)
        : createErrorInfo(this.type, this.error, this.meta)
    );
  }
}

export class DbError extends AppError implements ErrorInfo {
  public readonly type = 'Db';
  public readonly error: ErrorInfo['error'];
  public readonly meta?: ErrorInfoWithMeta['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Db(
      this.meta === undefined
        ? createErrorInfo(this.type, this.error)
        : createErrorInfo(this.type, this.error, this.meta)
    );
  }
}

export class ValidationError extends AppError implements ValidationErrorInfo {
  public readonly type = 'Validation';
  public readonly error: ValidationErrorInfo['error'];
  public readonly meta: ValidationErrorInfo['meta'];

  constructor(error: Error | string, meta: joi.ValidationError) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Validation(
      createErrorInfo(this.type, this.error, this.meta)
    );
  }
}
