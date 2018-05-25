const F = require('../../../../../sql/build/transactions/exchange/filters');
const createProxy = require('../../../../../../utils/test/proxy');

const getLastCall = spy => {
  const call = spy.mock.calls.slice(-2);
  return {
    [call[0][0].get]: call[1][0].apply,
  };
};

describe('transactions.exchange filter', () => {
  it('id', () => {
    const f = jest.fn();
    const p = createProxy(f);

    F.id('some_tx_id', p);
    expect(getLastCall(f)).toEqual({ where: ['t.id', 'some_tx_id'] });
  });

  it('limit', () => {
    const f = jest.fn();
    const p = createProxy(f);

    F.limit(100, p);
    expect(getLastCall(f)).toEqual({ limit: [100] });
  });

  it('timeStart', () => {
    const f = jest.fn();
    const p = createProxy(f);
    const t = new Date('2018-10-17');

    F.timeStart(t, p);
    expect(getLastCall(f)).toEqual({ where: ['t.time_stamp', '>=', t] });
  });

  it('timeEnd', () => {
    const f = jest.fn();
    const p = createProxy(f);
    const t = new Date('2018-10-17');

    F.timeEnd(t, p);
    expect(getLastCall(f)).toEqual({ where: ['t.time_stamp', '<=', t] });
  });

  it('sender', () => {
    const f = jest.fn();
    const p = createProxy(f);

    F.sender('qwe', p);
    expect(getLastCall(f)).toEqual({ where: ['o.sender', 'qwe'] });
  });

  it('matcher', () => {
    const f = jest.fn();
    const p = createProxy(f);

    F.matcher('qwe', p);
    expect(getLastCall(f)).toEqual({ where: ['t.sender', 'qwe'] });
  });
});
