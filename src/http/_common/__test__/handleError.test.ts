import {
  AppError,
  DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  DEFAULT_BAD_REQUEST_MESSAGE,
  DEFAULT_TIMEOUT_OCCURRED_MESSAGE,
} from '../../../errorHandling';
import { handleError } from '../handleError';
import { ValidationError, ValidationErrorItem } from 'joi';

describe('handleError', () => {
  const assertHttpResponse = (
    code: number,
    message: string,
    meta: any = undefined
  ) => (x: any) => {
    expect(x).toHaveProperty('status', code);
    expect(x).toHaveProperty(
      'body',
      JSON.stringify({
        message,
        meta,
      })
    );
    expect(x).toHaveProperty('headers');
  };

  const assertInternalServerErrorHttpResponse = assertHttpResponse(
    500,
    DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE
  );
  const assertTimeoutErrorHttpResponse = assertHttpResponse(
    504,
    DEFAULT_TIMEOUT_OCCURRED_MESSAGE
  );
  const assertBadRequestErrorHttpResponse = assertHttpResponse(
    400,
    DEFAULT_BAD_REQUEST_MESSAGE
  );
  const assertBadRequestErrorHttpResponseWithMeta = (meta: any[]) =>
    assertHttpResponse(400, DEFAULT_BAD_REQUEST_MESSAGE, meta);

  describe('internal server error handling', () => {
    it('should handle Init, Db, Resolver errors and return valid InternalServerError httpResponse', () => {
      assertInternalServerErrorHttpResponse(
        handleError(AppError.Init('init error'))
      );
      assertInternalServerErrorHttpResponse(
        handleError(AppError.Db('db error'))
      );
      assertInternalServerErrorHttpResponse(
        handleError(AppError.Resolver('resolver error'))
      );
    });
  });

  describe('timeout error handling', () => {
    it('should handle Timeout error and return valid TimeoutOccured httpResponse', () => {
      assertTimeoutErrorHttpResponse(
        handleError(AppError.Timeout('timeout error'))
      );
    });
  });

  describe('bad request', () => {
    describe('parse error', () => {
      it('should handle Parse error and return valid BadRequest httpResponse', () => {
        const parseErrorMessage = 'parse error';
        assertBadRequestErrorHttpResponseWithMeta([
          {
            message: parseErrorMessage,
          },
        ])(handleError(AppError.Parse(parseErrorMessage)));
      });
    });

    describe('validation error handling', () => {
      assertBadRequestErrorHttpResponse(
        handleError(AppError.Validation('validation error'))
      );

      const err = {
        details: [
          {
            message: 'joi error',
            type: 'error type',
            path: ['error', 'property', 'path'],
          } as ValidationErrorItem,
        ],
      } as ValidationError;

      it('should handle Validation error and return valid BadRequest httpResponse', () => {
        assertBadRequestErrorHttpResponseWithMeta(
          err.details.map(item => ({
            message: item.message,
          }))
        )(handleError(AppError.Validation('validation error', err as any)));

        const meta = { message: 'error description' };
        assertBadRequestErrorHttpResponseWithMeta([meta])(
          handleError(AppError.Validation('validation error', meta))
        );
      });
    });
  });
});
