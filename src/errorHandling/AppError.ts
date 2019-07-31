import { Matchable } from 'folktale';

export type ErrorMetaInfo = Record<string, unknown>;

export type ErrorType = keyof AppErrorPattern<any>;

export type ErrorInfo = {
  readonly error: Error;
  readonly type: ErrorType;
  readonly meta?: ErrorMetaInfo;
};

export type AppErrorPattern<C> = {
  Init: (e: ErrorInfo) => C;
  Resolver: (e: ErrorInfo) => C;
  Validation: (e: ErrorInfo) => C;
  Db: (e: ErrorInfo) => C;
};

const ensureError = (e: Error | string): Error =>
  e instanceof Error ? e : new Error(e);

const createErrorInfo = (
  type: ErrorType,
  error: Error,
  meta?: ErrorMetaInfo
): ErrorInfo => {
  if (typeof meta !== 'undefined')
    return {
      error,
      type,
      meta,
    };
  else
    return {
      error,
      type,
    };
};

// @todo more specific error types (e.g. resolver error is not informative about what really happened)
export abstract class AppError implements Matchable, ErrorInfo {
  public abstract readonly type: ErrorInfo['type'];
  public abstract readonly error: ErrorInfo['error'];
  public abstract readonly meta: ErrorInfo['meta'];

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

export class ResolverError extends AppError {
  public readonly type = 'Resolver';
  public readonly error: ErrorInfo['error'];
  public readonly meta: ErrorInfo['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Resolver(createErrorInfo(this.type, this.error, this.meta));
  }
}

export class DbError extends AppError {
  public readonly type = 'Db';
  public readonly error: ErrorInfo['error'];
  public readonly meta: ErrorInfo['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.error = ensureError(error);
    this.meta = meta;
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Db(createErrorInfo(this.type, this.error, this.meta));
  }
}

export class ValidationError extends AppError {
  public readonly type = 'Validation';
  public readonly error: ErrorInfo['error'];
  public readonly meta: ErrorInfo['meta'];

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
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
