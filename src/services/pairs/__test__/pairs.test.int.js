const pg = require('knex')({ client: 'pg' });
const { createPgDriver } = require('../../../db');
const loadConfig = require('../../../loadConfig');
const options = loadConfig();
const pgDriver = createPgDriver(options);
const create = require('../index');
const { BigNumber } = require('@waves/data-entities');
let pair;

describe('Pairs', () => {
  const service = create({
    drivers: { pg: pgDriver },
    emitEvent: () => () => null,
  });

  beforeAll(async () => {
    pair = await pgDriver
      .one(
        pg('pairs')
          .select('*')
          .limit(1)
          .toString()
      )
      .run()
      .promise();
  });

  describe('get one pair', () => {
    it('should return Pair for one correctly', async () => {
      const result = await service
        .get({
          amountAsset: pair.amount_asset_id,
          priceAsset: pair.price_asset_id,
        })
        .run()
        .promise();

      expect(result.data).toHaveProperty('firstPrice', pair.first_price);
      expect(result.data).toHaveProperty('lastPrice', pair.last_price);
      expect(result.data).toHaveProperty('volume', pair.volume);
      expect(result.data).toHaveProperty('volumeWaves', pair.volume_waves);
    });

    it('should return null for non existing pair', done => {
      service
        .get({
          amountAsset: '111',
          priceAsset: '222',
        })
        .run()
        .listen({
          onResolved: nullable => {
            expect(nullable).toEqual(null);
            done();
          },
        });
    });
  });

  describe('get many pairs', () => {
    it('should return Pairs for one correctly', async () => {
      const result = await service
        .mget([
          {
            amountAsset: pair.amount_asset_id,
            priceAsset: pair.price_asset_id,
          },
        ])
        .run()
        .promise();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].data).toHaveProperty(
        'firstPrice',
        pair.first_price
      );
      expect(result.data[0].data).toHaveProperty('lastPrice', pair.last_price);
      expect(result.data[0].data).toHaveProperty('volume', pair.volume);
      expect(result.data[0].data).toHaveProperty(
        'volumeWaves',
        pair.volume_waves
      );
    });

    it('should return null for non existing pairs', done => {
      service
        .mget([
          {
            amountAsset: '111',
            priceAsset: '222',
          },
        ])
        .run()
        .listen({
          onResolved: pairs => {
            expect(pairs.__type).toEqual('list');
            expect(pairs.data).toEqual([null]);
            done();
          },
        });
    });
  });

  describe('search pairs', () => {
    it('should return Pairs correctly', async () => {
      const result = await service
        .search({
          limit: 2
        })
        .run()
        .promise();

      result.data.forEach(pair => {
        expect(typeof pair.amountAsset).toBe('string');
        expect(typeof pair.priceAsset).toBe('string');
        expect(pair.data.firstPrice).toBeInstanceOf(BigNumber);
        expect(pair.data.lastPrice).toBeInstanceOf(BigNumber);
        expect(pair.data.volume).toBeInstanceOf(BigNumber);
        expect(pair.data.volumeWaves).toBeInstanceOf(BigNumber);
      });
    });
  });
});
