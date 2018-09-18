const F = require('../../../../sql/transactions/exchange/filters');
const P = require('../../../../../utils/test/proxy');

describe('transactions.exchange filter', () => {
  it('id', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.id('some_tx_id', p);
    expect(P.select(f).lastCall).toEqual({ where: ['t.id', 'some_tx_id'] });
  });

  it('limit', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.limit(100, p);
    expect(P.select(f).lastCall).toEqual({ limit: [100] });
  });

  it('timeStart', () => {
    const f = jest.fn();
    const p = P.create(f);
    const t = new Date('2018-10-17');

    F.timeStart(t, p);
    expect(P.select(f).lastCall).toEqual({ where: ['t.time_stamp', '>=', t] });
  });

  it('timeEnd', () => {
    const f = jest.fn();
    const p = P.create(f);
    const t = new Date('2018-10-17');

    F.timeEnd(t, p);
    expect(P.select(f).lastCall).toEqual({ where: ['t.time_stamp', '<=', t] });
  });

  it('sender', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.sender('qwe', p);
    expect(P.select(f).lastCall).toEqual({ where: ['o.sender', 'qwe'] });
  });

  it('matcher', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.matcher('qwe', p);
    expect(P.select(f).lastCall).toEqual({ where: ['t.sender', 'qwe'] });
  });

  it('amountAsset', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.amountAsset('ASSET_ID', p);
    expect(P.select(f).lastCall).toEqual({
      where: ['t.amount_asset', 'ASSET_ID'],
    });
  });

  it('priceAsset', () => {
    const f = jest.fn();
    const p = P.create(f);

    F.priceAsset('ASSET_ID', p);
    expect(P.select(f).lastCall).toEqual({
      where: ['t.price_asset', 'ASSET_ID'],
    });
  });
});
