const truncateTable = require('../truncateTable');

describe('pairs daemon sql test', () => {
  it('truncate table', () => {
    expect(truncateTable('pairs')).toMatchSnapshot();
  });
});
