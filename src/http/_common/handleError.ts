import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
  DEFAULT_BAD_REQUEST_MESSAGE,
} from '../../errorHandling';
import { HttpResponse } from './types';
import { defaultStringify } from './utils';

export const handleError = (error: AppError): HttpResponse => {
  return error.matchWith({
    Init: () => ({
      status: 500,
      body: defaultStringify({
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      }),
    }),
    Db: () => ({
      status: 500,
      body: defaultStringify({
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      }),
    }),
    Resolver: () => ({
      status: 500,
      body: defaultStringify({
        message: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
      }),
    }),
    Parse: errorInfo => ({
      status: 400,
      body: defaultStringify({
        message: DEFAULT_BAD_REQUEST_MESSAGE,
        meta: [
          {
            message: errorInfo.error.message,
          },
        ],
      }),
    }),
    Validation: errorInfo => ({
      status: 400,
      body: defaultStringify({
        message: 'Validation Error',
        meta:
          errorInfo.meta !== undefined
            ? Array.isArray(errorInfo.meta.details)
              ? errorInfo.meta.details.map(error => ({
                  message: error.message,
                }))
              : errorInfo.meta
            : undefined,
      }),
    }),
    Timeout: () => ({
      status: 504,
      body: defaultStringify({
        message: DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
      }),
    }),
  });
};
