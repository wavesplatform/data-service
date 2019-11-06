import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  DEFAULT_A_TIMEOUT_OCCURRED_MESSAGE,
} from '../errorHandling';

const isStatementTimeoutErrorMessage = (message: string) =>
  message === 'canceling statement due to statement timeout';

export const handleError = ({ ctx, error }: { ctx: any; error: AppError }) => {
  ctx.eventBus.emit('ERROR', error);
  error.matchWith({
    Init: () => {
      ctx.status = 500;
      ctx.state.returnValue = {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      };
    },
    Db: e => {
      if (isStatementTimeoutErrorMessage(e.error.message)) {
        ctx.status = 524;
        ctx.state.returnValue = {
          message: DEFAULT_A_TIMEOUT_OCCURRED_MESSAGE,
        };
      } else {
        ctx.status = 500;
        ctx.state.returnValue = {
          message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
        };
      }
    },
    Resolver: () => {
      ctx.status = 500;
      ctx.state.returnValue = {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      };
    },
    Validation: errorInfo => {
      ctx.status = 400;
      ctx.state.returnValue = {
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
