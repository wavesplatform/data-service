import { Middleware } from 'koa';
import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
} from '../errorHandling';

const isAppError = (error: any): error is AppError =>
  error && typeof error.matchWith === 'function';

export const captureErrors = (
  errorHandler: ({ ctx, error }: { ctx: any; error: any }) => void
) => (middleware: Middleware) => (ctx: any, next: any): any =>
  middleware(ctx, next).catch((error: AppError | Error) => {
    if (isAppError(error)) return errorHandler({ ctx, error });
    ctx.status = 500;
    ctx.body = {
      message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
    };
    ctx.eventBus.emit('ERROR', {
      error: error,
      type: 'UnhandledError',
    });
  });
