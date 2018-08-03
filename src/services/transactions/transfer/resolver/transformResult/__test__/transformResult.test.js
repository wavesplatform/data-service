const transformResultsOne = require('../one');
const transformResultsMany = require('../many');
const txRaw = require('./mocks/tx');
const Maybe = require('folktale/maybe');

const request = {
  sort: 'asc',
};
describe('Transfer transactions transformResult function', () => {
  it('works for one', () => {
    expect(transformResultsOne(Maybe.Just(txRaw))).toMatchSnapshot();
  });
  it('works for many', () => {
    expect(
      transformResultsMany(
        [
          Maybe.Just(txRaw),
          Maybe.Just(txRaw),
          Maybe.Nothing(),
          Maybe.Just(txRaw),
        ],
        request
      )
    ).toMatchSnapshot();
  });
});
