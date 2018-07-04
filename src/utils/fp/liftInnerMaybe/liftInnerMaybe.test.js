const Maybe = require('folktale/maybe');
const Result = require('folktale/result');

const { ifElse, equals, compose } = require('ramda');

const liftInnerMaybe = require('./');

const mockValidate = ifElse(equals(1), Result.of, compose(Result.Error, Error));

test('liftInnerM', () => {
  const validateMaybeV = liftInnerMaybe(Result.of, mockValidate);

  expect(validateMaybeV(Maybe.of(1))).toEqual(Result.of(Maybe.of(1)));
  expect(validateMaybeV(Maybe.of(2))).toEqual(Result.Error(Error(2)));
});
