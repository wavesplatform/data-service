import { Matchable } from 'folktale';

export type ErrorMetaInfo = Record<string, unknown>;

export type ErrorType = keyof AppErrorPattern<any>;

export type ErrorInfo = {
  error: Error;
  type: ErrorType;
  meta?: ErrorMetaInfo;
};

export type AppErrorPattern<C> = {
  Resolver: (e: ErrorInfo) => C;
  Validation: (e: ErrorInfo) => C;
  Db: (e: ErrorInfo) => C;
};

const createErrorInfo = (
  type: ErrorType,
  error: Error | string,
  meta?: ErrorMetaInfo
) => {
  const errInfo: ErrorInfo =
    error instanceof Error
      ? {
          error,
          type,
        }
      : {
          error: new Error(error),
          type,
        };

  if (meta) errInfo.meta = meta;
  return errInfo;
};

export abstract class AppError implements Matchable {
  public abstract matchWith<C>(pattern: AppErrorPattern<C>): C;

  public static Db(error: Error | string, meta?: ErrorMetaInfo) {
    return new DbError(error, meta);
  }
  public static Resolver(error: Error | string, meta?: ErrorMetaInfo) {
    return new ResolverError(error, meta);
  }
  public static Validation(error: Error | string, meta?: ErrorMetaInfo) {
    return new ValidationError(error, meta);
  }
}

export class ResolverError extends AppError {
  public readonly type: string = 'ResolverError';
  private readonly errorInfo: ErrorInfo;

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.errorInfo = createErrorInfo('Resolver', error, meta);
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Resolver(this.errorInfo);
  }
}

export class DbError extends AppError {
  public readonly type: string = 'DbError';
  private readonly errorInfo: ErrorInfo;

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.errorInfo = createErrorInfo('Db', error, meta);
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Db(this.errorInfo);
  }
}

export class ValidationError extends AppError {
  public readonly type: string = 'ValidationError';
  private readonly errorInfo: ErrorInfo;

  constructor(error: Error | string, meta?: ErrorMetaInfo) {
    super();
    this.errorInfo = createErrorInfo('Validation', error, meta);
  }

  public matchWith<C>(pattern: AppErrorPattern<C>): C {
    return pattern.Validation(this.errorInfo);
  }
}
