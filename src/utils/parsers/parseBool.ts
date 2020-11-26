import { Ok as ok, Error as error } from 'folktale/result';
import { isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { Parser } from '../../http/_common/filters/types';

export const parseBool: Parser<boolean | undefined> = maybeBool => {
  if (isNil(maybeBool)) {
    return ok(undefined);
  }

  const err = error<ParseError, boolean>(
    new ParseError(new Error('Invalid boolean value'))
  );

  if (typeof maybeBool === 'string') {
    switch (true) {
      case maybeBool.toLowerCase() === 'false':
        return ok(false);
      case maybeBool.toLowerCase() === 'true':
        return ok(true);
      case maybeBool === '':
      case maybeBool === '0':
      case maybeBool === 'undefined':
      case maybeBool === 'NaN':
      case maybeBool.toLowerCase() === 'null':
        return err;
      default:
        return err;
    }
  } else if (typeof maybeBool === 'boolean') {
    return ok(maybeBool);
  } else {
    return err;
  }
};
