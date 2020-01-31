import { AppError, DEFAULT_BAD_REQUEST_MESSAGE } from '../../errorHandling';
import { HttpResponse } from './types';
import { defaultStringify } from './utils';

export const handleError = (error: AppError): HttpResponse => {
  return error.matchWith({
    Init: () => HttpResponse.InternalServerError(),
    Db: () => HttpResponse.InternalServerError(),
    Resolver: () => HttpResponse.InternalServerError(),
    Parse: errorInfo =>
      HttpResponse.BadRequest(
        defaultStringify({
          message: DEFAULT_BAD_REQUEST_MESSAGE,
          meta: [
            {
              message: errorInfo.error.message,
            },
          ],
        })
      ),
    Validation: errorInfo =>
      HttpResponse.BadRequest(
        defaultStringify({
          message: 'Validation Error',
          meta:
            errorInfo.meta !== undefined
              ? Array.isArray(errorInfo.meta.details)
                ? errorInfo.meta.details.map(error => ({
                    message: error.message,
                  }))
                : errorInfo.meta
              : undefined,
        })
      ),
    Timeout: () => HttpResponse.TimeoutOccured(),
  });
};
