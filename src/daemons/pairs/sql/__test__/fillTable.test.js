const fillTable = require('../fillTable');

describe('pairs daemon sql test', () => {
  it('fill table', () => {
    expect(fillTable('pairs')).toMatchSnapshot();
  });
});
