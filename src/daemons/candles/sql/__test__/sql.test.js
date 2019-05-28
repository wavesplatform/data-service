const sql = require('../query');
const { BigNumber } = require('@waves/data-entities');

describe('candles daemon sql test', () => {
  it('truncate table', () => {
    expect(sql.truncateTable('candles')).toMatchSnapshot();
  });

  it('insert all candles group by 1 minute', () => {
    expect(sql.insertAllMinuteCandles('candles')).toMatchSnapshot();
  });

  it('calculate and insert all candles from other small candles', () => {
    expect(sql.insertAllCandles('candles', 60, 300)).toMatchSnapshot();
  });

  it('get all candles from exchange tx grouped by 1 minute and after timestamp', () => {
    expect(sql.selectCandlesByMinute(new Date('2019-01-01T00:00:00.000Z'))).toMatchSnapshot();
  });

  it('insert or update array of candles', () => {
    expect(
      sql.insertOrUpdateCandles('candles', [
        {
          time_start: new Date(0),
          low: new BigNumber(1),
          high: new BigNumber(100),
          open: new BigNumber(20),
          close: new BigNumber(80),
          amount_asset_id: '1',
          price_asset_id: '2',
          price: new BigNumber(1.2),
          volume: new BigNumber(200.2),
          quote_volume: new BigNumber(100.2),
          txs_count: new BigNumber(22),
          weighted_average_price: new BigNumber(2.1),
        },
      ])
    ).toMatchSnapshot();
  });

  it('insert or update candles empty', () => {
    expect(
      sql.insertOrUpdateCandles('candles', []).toString()
    ).toMatchSnapshot();
  });

  it('get last candle', () => {
    expect(sql.selectLastCandle('candles').toString()).toMatchSnapshot();
  });

  it('get last exchange tx', () => {
    expect(sql.selectLastExchangeTx().toString()).toMatchSnapshot();
  });

  it('insert or update candles from height', () => {
    expect(
      sql
        .insertOrUpdateCandlesFromShortInterval(
          'candles',
          new Date('2019-01-01T00:00:00.000Z'),
          60,
          300
        )
        .toString()
    ).toMatchSnapshot();
  });
});
