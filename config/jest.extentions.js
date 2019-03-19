const Maybe = require('folktale/maybe');
const { equals } = require('ramda');

expect.extend({
  toBeNothing(maybe) {
    if (Maybe.hasInstance(maybe)) {
      return maybe.matchWith({
        Just: () => ({
          message: () => `${maybe} should be instance of Maybe.Nothing`,
          pass: false,
        }),
        Nothing: () => ({
          message: () => `${maybe} is instance of Maybe.Nothing`,
          pass: true,
        }),
      });
    } else {
      return {
        message: () => `${maybe} should be instance of Maybe`,
        pass: false,
      };
    }
  },
  toBeJust(maybe, expected) {
    if (Maybe.hasInstance(maybe)) {
      return maybe.matchWith({
        Just: ({ value }) => ({
          message: () =>
            `${maybe} is ${
              equals(value, expected) ? '' : 'not'
            } equal to ${expected}`,
          pass: equals(value, expected),
        }),
        Nothing: () => ({
          message: () => `${maybe} should to be instance of Maybe.Just`,
          pass: false,
        }),
      });
    } else {
      return {
        message: () => `${maybe} should to be instance of Maybe`,
        pass: false,
      };
    }
  },
});
