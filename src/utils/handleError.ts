import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
} from '../errorHandling';

export const handleError = ({ ctx, error }: { ctx: any; error: AppError }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Init: () => {
      ctx.status = 500;
      ctx.body = {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      };
    },
    Db: () => {
      ctx.status = 500;
      ctx.body = {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      };
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      };
    },
    Validation: errorInfo => {
      ctx.status = 400;
      ctx.body = {
        message: 'Validation Error',
        meta:
          errorInfo.meta !== undefined
            ? Array.isArray(errorInfo.meta.details)
              ? errorInfo.meta.details.map(error => ({
                  message: error.message,
                }))
              : errorInfo.meta
            : undefined,
      };
    },
  });
};
