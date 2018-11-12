const sql = require('../sql');

test('Assets knex should build the sql query', () => {
  expect(sql(['q', 'w', 'e'])).toMatchSnapshot();
});
