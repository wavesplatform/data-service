import { truncateTable } from '../truncateTable';

describe('pairs daemon sql test', () => {
  it('truncate table', () => {
    expect(truncateTable('pairs')).toMatchSnapshot();
  });
});
