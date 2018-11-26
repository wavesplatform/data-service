const sql = require('../query');

describe('candles daemon sql test', () => {
  it('get last candle order by max_height', () => {
    expect(sql.selectLastCandle().toString()).toMatchSnapshot();
  });

  it('get last exchange order by height', () => {
    expect(sql.selectLastExchange().toString()).toMatchSnapshot();
  });

  it('create candles table with indexes', () => {
    expect(sql.createCandlesTable.toString()).toMatchSnapshot();
  });

  it('update candles all', () => {
    expect(sql.updateCandlesAll.toString()).toMatchSnapshot();
  });

  it('select candles by 1 minute', () => {
    expect(sql.selectCandlesByMinute(777).toString()).toMatchSnapshot();
  });

  it('insert or update candles empty', () => {
    expect(sql.insertOrUpdateCandles([]).toString()).toMatchSnapshot();
  });

  it('insert or update candles', () => {
    expect(sql.insertOrUpdateCandles([{
      time_start: new Date(0),
      low: 1,
      hight: 100,
      open: 20,
      close: 80,
      amount_asset_id: '1',
      price_asset_id: '2',
      price: 1.2,
      price_volume: 100.2,
      txs_count: 22,
      weighted_average_price: 2.1
    }]).toString()).toMatchSnapshot();
  });
});
