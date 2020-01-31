import { AppError } from '../../errorHandling';
import { HttpResponse } from './types';

export const handleError = (error: AppError): HttpResponse => {
  return error.matchWith({
    Init: () => HttpResponse.InternalServerError(),
    Db: () => HttpResponse.InternalServerError(),
    Resolver: () => HttpResponse.InternalServerError(),
    Parse: errorInfo =>
      HttpResponse.BadRequest([
        {
          message: errorInfo.error.message,
        },
      ]),
    Validation: errorInfo =>
      HttpResponse.BadRequest(
        errorInfo.meta !== undefined
          ? Array.isArray(errorInfo.meta.details)
            ? errorInfo.meta.details.map(error => ({
                message: error.message,
              }))
            : [{ message: errorInfo.meta }]
          : undefined
      ),
    Timeout: () => HttpResponse.TimeoutOccured(),
  });
};
