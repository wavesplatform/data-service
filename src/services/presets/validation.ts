import { AppError } from '../../errorHandling';
import { validate } from '../../utils/validation';
import { SchemaLike } from 'joi';

export const validateInput = <T>(schema: SchemaLike, name: string) => (
  value: T
) =>
  validate(
    schema,
    (error, value) =>
      AppError.Validation('Input validation failed', {
        resolver: name,
        error,
        value,
      }),
    value
  );

export const validateResult = <T>(schema: SchemaLike, name: string) => (
  value: T
) =>
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
