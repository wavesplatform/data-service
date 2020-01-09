import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
  DEFAULT_BAD_REQUEST_MESSAGE,
} from '../../errorHandling';
import { HttpResponseDto } from './types';

export const handleError = (error: AppError): HttpResponseDto => {
  return error.matchWith({
    Init: () => ({
      status: 500,
      body: {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      },
    }),
    Db: () => ({
      status: 500,
      body: {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      },
    }),
    Resolver: () => ({
      status: 500,
      body: {
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      },
    }),
    Parse: errorInfo => ({
      status: 400,
      body: {
        message: DEFAULT_BAD_REQUEST_MESSAGE,
        meta: [
          {
            message: errorInfo.error.message,
          },
        ],
      },
    }),
    Validation: errorInfo => ({
      status: 400,
      body: {
        message: 'Validation Error',
        meta:
          errorInfo.meta !== undefined
            ? Array.isArray(errorInfo.meta.details)
              ? errorInfo.meta.details.map(error => ({
                  message: error.message,
                }))
              : errorInfo.meta
            : undefined,
      },
    }),
    Timeout: () => ({
      status: 504,
      body: {
        message: DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
      },
    }),
  });
};
