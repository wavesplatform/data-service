import { AppError, ValidationErrorInfo } from '../../errorHandling';
import { HttpResponse } from './types';
import * as joi from 'joi';

const isJoiValidationError = (
  errMeta: ValidationErrorInfo['meta']
): errMeta is joi.ValidationError =>
  typeof errMeta !== 'undefined' && Array.isArray(errMeta.details);

export const handleError = (error: AppError): HttpResponse => {
  return error.matchWith({
    Init: () => HttpResponse.InternalServerError(),
    Db: () => HttpResponse.InternalServerError(),
    Resolver: () => HttpResponse.InternalServerError(),
    Parse: errorInfo =>
      HttpResponse.BadRequest([
        {
          message: errorInfo.error.message,
          ...errorInfo.meta,
        },
      ]),
    Validation: errorInfo => {
      const errorInfoMeta = errorInfo.meta;
      if (isJoiValidationError(errorInfoMeta)) {
        return HttpResponse.BadRequest(
          errorInfoMeta.details.map(error => ({
            message: error.message,
          }))
        );
      } else if (errorInfoMeta !== undefined) {
        return HttpResponse.BadRequest([
          {
            message: errorInfo.error.message,
            ...errorInfoMeta,
          },
        ]);
      } else {
        return HttpResponse.BadRequest();
      }
    },
    Timeout: () => HttpResponse.TimeoutOccured(),
  });
};
