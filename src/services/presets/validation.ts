import { AppError, ValidationError, ResolverError } from '../../errorHandling';
import { validate } from '../../utils/validation';
import { SchemaLike } from 'joi';
import { Result } from 'folktale/result';
import { Task } from 'folktale/concurrency/task';
import { resultToTask } from '../../utils/fp';

export const validateInput = <T>(schema: SchemaLike, name: string) => (
  value: T
): Task<ValidationError, T> =>
  resultToTask(
    validate(
      schema,
      (error, value) =>
        AppError.Validation('Input validation failed', {
          resolver: name,
          error,
          value,
        }),
      value
    )
  );

export const validateResult = <T>(schema: SchemaLike, name: string) => (
  value: T
): Result<ResolverError, T> =>
  validate(
    schema,
    (error, value) =>
      AppError.Resolver('Result validation failed', {
        resolver: name,
        value,
        error,
      }),
    value
  );
