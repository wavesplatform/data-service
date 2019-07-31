import { Matchable } from 'folktale';
import * as joi from 'joi';

export type ErrorMetaInfo = Record<string, unknown>;

export type ErrorType = keyof AppErrorPattern<any>;

export type CommonErrorInfo = {
  readonly error: Error;
  readonly type: ErrorType;
};

export type ErrorInfo = CommonErrorInfo & {
  readonly meta?: ErrorMetaInfo;
};

export type ValidationErrorInfo = CommonErrorInfo & {
  readonly meta?: ErrorMetaInfo | joi.ValidationError;
};

export type AppErrorPattern<C> = {
  Db: (e: ErrorInfo) => C;
  Init: (e: ErrorInfo) => C;
  Resolver: (e: ErrorInfo) => C;
  Validation: (e: ValidationErrorInfo) => C;
};

const isJoiError = (err: any): err is joi.ValidationError => {
  return err && err.isJoi;
};

const ensureError = (e: Error | string): Error =>
  e instanceof Error ? e : new Error(e);

function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta?: ErrorMetaInfo
): ErrorInfo;
function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta?: ErrorMetaInfo | joi.ValidationError
): ErrorInfo | ValidationErrorInfo;
function createErrorInfo(
  type: ErrorType,
  error: Error,
  meta?: ErrorMetaInfo | joi.ValidationError
): ErrorInfo | ValidationErrorInfo {
  if (isJoiError(meta)) {
    return {
      error,
      type,
      meta,
    };
  } else {
    return {
      error,
      type,
      meta,
    };
  }
}

// @todo more specific error types (e.g. resolver error is not informative about what really happened)
export abstract class AppError implements Matchable {
  public abstract readonly type: ErrorInfo['type'];
  public abstract readonly error: ErrorInfo['error'];

  public abstract matchWith<C>(pattern: AppErrorPattern<C>): C;

  public static Db(error: Error | string, meta?: ErrorMetaInfo) {
    return new DbError(error, meta);
  }
  public static Init(error: Error | string, meta?: ErrorMetaInfo) {
    return new InitError(error, meta);
  }
  public static Resolver(error: Error | string, meta?: ErrorMetaInfo) {
    return new ResolverError(error, meta);
  }
  public static Validation(error: Error | string, meta?: ErrorMetaInfo) {
    return new ValidationError(error, meta);
  }
}

export class InitError extends AppError {
  public readonly type = 'Init';
  public readonly error: ErrorInfo['error'];
  public readonly meta: ErrorInfo['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Init(createErrorInfo(this.type, this.error, this.meta));
  }
}

export class ResolverError extends AppError implements ErrorInfo {
  public readonly type = 'Resolver';
  public readonly error: ErrorInfo['error'];
  public readonly meta?: ErrorInfo['meta'];

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
  public readonly meta?: ErrorInfo['meta'];

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

export class ValidationError extends AppError {
  public readonly type = 'Validation';
  public readonly error: ErrorInfo['error'];
  public readonly meta?: ErrorInfo['meta'] | joi.ValidationError;

  constructor(error: Error | string, meta?: ErrorInfo['meta']) {
    super();
    this.error = ensureError(error);
    this.meta =
      meta && meta.error && isJoiError(meta.error) ? meta.error : meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Validation(
      createErrorInfo(this.type, this.error, this.meta)
    );
  }
}
