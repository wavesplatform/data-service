import sql from '../pg/sql';
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
    expect(sql.search(filterValues[0])).toMatchSnapshot();
  });

  it('supports function filter', () => {
    expect(sql.search(filterValues[1])).toMatchSnapshot();
  });

  it('supports dapp and function filters', () => {
    expect(sql.search(filterValues[2])).toMatchSnapshot();
  });
});
