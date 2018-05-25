const select = jestSpy => ({
  get events() {
    return jestSpy.mock.calls;
  },

  get lastCall() {
    const call = jestSpy.mock.calls.slice(-2);
    return {
      [call[0][0].get]: call[1][0].apply,
    };
  },

  get lastField() {
    return jestSpy.mock.calls.slice(-1)[0].get;
  },
});

module.exports = select;
