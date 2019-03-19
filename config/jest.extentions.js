const Maybe = require('folktale/maybe');
const { equals } = require('ramda');

expect.extend({
  toBeNothing(received) {
    if (Maybe.hasInstance(received)) {
      return received.matchWith({
        Just: () => ({
          message: () => `${received} should be instance of Maybe.Nothing`,
          pass: false,
        }),
        Nothing: () => ({
          message: () => `${received} is instance of Maybe.Nothing`,
          pass: true,
        }),
      });
    } else {
      return {
        message: () => `${received} should be instance of Maybe`,
        pass: false,
      };
    }
  },
  toBeJust(received, expected) {
    if (Maybe.hasInstance(received)) {
      return received.matchWith({
        Just: ({ value }) => ({
          message: () =>
            `${received} is ${
              equals(value, expected) ? '' : 'not'
            } equal to ${expected}`,
          pass: equals(value, expected),
        }),
        Nothing: () => ({
          message: () => `${received} should to be instance of Maybe.Just`,
          pass: false,
        }),
      });
    } else {
      return {
        message: () => `${received} should to be instance of Maybe`,
        pass: false,
      };
    }
  },
});
