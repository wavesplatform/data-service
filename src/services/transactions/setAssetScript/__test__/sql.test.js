const sql = require('../sql');
const filterValues = [{
  script: 'base64:somescript',
}, {
  assetId: 'WAVES'
}, {
  script: 'base64:somescript',
  assetId: 'WAVES'
}];

describe('Sql search by type-specific filters', () => {
  it('supports script filter', () => {
    expect(sql.search(filterValues[0])).toMatchSnapshot();
  });

  it('supports assetId filter', () => {
    expect(sql.search(filterValues[1])).toMatchSnapshot();
  });

  it('supports assetId and script filters', () => {
    expect(sql.search(filterValues[2])).toMatchSnapshot();
  });
});
