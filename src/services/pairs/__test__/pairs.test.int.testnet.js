const { createPgDriver } = require('../../../db');
const loadConfig = require('../../../loadConfig');
const options = loadConfig();
const create = require('../index');

const amountAsset = 'CVRciuSiK8xiNJSRitAG9dGqcmfFPHvn9bcXtntnpuvp';
const priceAsset = 'WAVES';

describe('Pairs', () => {
  const service = create({
    drivers: { pg: createPgDriver(options) },
    emitEvent: () => () => null,
  });

  describe('get one pair', () => {
    it('should return Pair for one correctly', done => {
      service
        .get({
          amountAsset,
          priceAsset,
        })
        .run()
        .listen({
          onResolved: pair => {
            expect(pair).toMatchSnapshot();
            done();
          },
        });
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
    it('should return Pairs for one correctly', done => {
      service
        .mget([
          {
            amountAsset,
            priceAsset,
          },
        ])
        .run()
        .listen({
          onResolved: pairs => {
            expect(pairs).toMatchSnapshot();
            done();
          },
        });
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
});
