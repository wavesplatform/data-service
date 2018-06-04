const { encode, decode } = require('./cursor');

describe('Cursor module', () => {
  const dateString = new Date('2018-01-01').toISOString();
  const tx = {
    tx_id: 'qwe456asd',
    tx_time_stamp: dateString,
  };

  it('should encode transactions correctly', () => {
    expect(encode(tx)).toBe(`qwe456asd::${dateString}`);
  });

  it('should decode transactions correctly', () => {
    const sort = {
      asc: [{ timestamp: 'asc' }],
      desc: [{ timestamp: 'desc' }],
    };
  });
});
