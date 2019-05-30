import { search } from '../pg/sql';
const filterValues = [
  {
    dapp: '3N92gNUHh6jnZmZtdgECTm3cNAZb1Zei6Ve',
  },
  {
    function: 'deposit',
  },
  {
    dapp: 'b3N92gNUHh6jnZmZtdgECTm3cNAZb1Zei6Ve',
    function: 'deposit',
  },
];

describe('Sql search by type-specific filters', () => {
  it('supports dapp filter', () => {
    expect(search(filterValues[0])).toMatchSnapshot();
  });

  it('supports function filter', () => {
    expect(search(filterValues[1])).toMatchSnapshot();
  });

  it('supports dapp and function filters', () => {
    expect(search(filterValues[2])).toMatchSnapshot();
  });
});
