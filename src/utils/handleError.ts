import { AppError } from '../errorHandling';

export const handleError = ({ ctx, error }: { ctx: any; error: AppError }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Db: () => {
      ctx.status = 500;
      ctx.body = {
        message: 'Database Error',
      };
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Error. Please, try again later.',
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
