import { Middleware } from 'koa';
import { AppError } from '../errorHandling';

const isAppError = (error: any): error is AppError => {
  return error && typeof error.matchWith === 'function' ? true : false;
};

export const captureErrors = (
  errorHandler: ({ ctx, error }: { ctx: any; error: any }) => void
) => (middleware: Middleware) => (ctx: any, next: any): any =>
  middleware(ctx, next).catch((error: AppError | Error) => {
    if (isAppError(error)) return errorHandler({ ctx, error });
    ctx.status = 500;
    ctx.body = {
      message: 'Something went wrong',
    };
    ctx.eventBus.emit('ERROR', {
      error: error,
      type: 'UnhandledError',
    });
  });