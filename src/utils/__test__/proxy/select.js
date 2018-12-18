const { equals } = require('ramda');

const select = jestSpy => ({
  get events() {
    return jestSpy.mock.calls.map(x => x[0]);
  },

  get lastCall() {
    if (jestSpy.mock.calls.length < 2)
      throw new Error('Last proxy interaction was not a method call.');

    const call = jestSpy.mock.calls.slice(-2);

    const { get } = call[0][0];
    const { apply } = call[1][0];

    if (!get || !apply)
      throw new Error('Last proxy interaction was not a method call.');

    return {
      [call[0][0].get]: call[1][0].apply,
    };
  },

  get lastField() {
    if (jestSpy.mock.calls.length < 1)
      throw new Error('No proxy interactions so far.');

    const { get } = jestSpy.mock.calls.slice(-1)[0][0];

    if (!get)
      throw new Error('Last proxy interaction was not a field resolve.');

    return get;
  },

  callIndex(args) {
    return jestSpy.mock.calls.findIndex(x => equals(x[0].apply, args));
  },
});

module.exports = select;
