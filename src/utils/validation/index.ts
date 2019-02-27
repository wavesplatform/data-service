import * as JoiRaw from './joi';
import { Error as errorResult, Ok as okResult } from 'folktale/result';

import { SchemaLike, ValidationError } from 'joi';

export const validate = <ErrorType, T>(
  schema: SchemaLike,
  errorFactory: (e: ValidationError, value: T) => ErrorType,
  value: T
) => {
  const { error } = JoiRaw.validate(value, schema, { convert: false });
  return error
    ? errorResult<ErrorType, T>(errorFactory(error, value))
    : okResult<ErrorType, T>(value);
};

export const Joi = JoiRaw;
