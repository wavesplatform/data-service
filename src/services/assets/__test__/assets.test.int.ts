const http = require('http');

import { parse } from '../../../utils/json';

import createService, { createCache } from '../index';

// dependencies
import { createPgDriver } from '../../../db';
import { loadConfig } from '../../../loadConfig';
import { EventEmitter } from 'events';
import { SortOrder } from '../../_common';

const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const cache = createCache(10, 10000);

const DEFAULT_TIMEOUT_IN_MS = 30000;

const service = createService({
  drivers,
  emitEvent: () => () => null,
  cache,
  timeouts: {
    get: DEFAULT_TIMEOUT_IN_MS,
    mget: DEFAULT_TIMEOUT_IN_MS,
    search: DEFAULT_TIMEOUT_IN_MS,
  },
});

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

describe('Assets service', () => {
  describe('get', () => {
    it('fetches a real asset', async done => {
      service
        .get(assetId)
        .run()
        .promise()
        .then(x => {
          expect(x.unsafeGet()).toMatchSnapshot();
          done();
        })
        .catch(done.fail);
    });

    it('returns null for unreal tx', async () => {
      const tx = await service
        .get('UNREAL')
        .run()
        .promise();

      expect(tx).toBeNothing();
    });
  });

  describe('mget', () => {
    it('fetches real assets with nulls for unreal', async done => {
      service
        .mget([assetId, 'UNREAL'])
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });
  });

  describe('search', () => {
    it('fetches WAVES by ticker', async done => {
      service
        .search({ ticker: 'WAVES', limit: 1, sort: SortOrder.Descending })
        .run()
        .promise()
        .then(xs => {
          expect(xs).toMatchSnapshot();
          done();
        })
        .catch(e => done(JSON.stringify(e)));
    });

    it('fetches non-WAVES asset by ticker (BTC)', async done => {
      http.get(
        'http://nodes.wavesnodes.com/assets/details/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        (res: EventEmitter) => {
          let data: string = '';
          res.on('data', (chunk: string) => (data += chunk));
          res.on('end', () => {
            const assetInfoFromNode: any = parse(data);
            service
              .search({ ticker: 'BTC', limit: 1, sort: SortOrder.Descending })
              .run()
              .promise()
              .then(xs => {
                const assetInfo = xs.data[0].data;
                if (assetInfo !== null) {
                  expect(assetInfo.description).toMatch(
                    assetInfoFromNode.description
                  );
                  expect(assetInfo.height.toString()).toMatch(
                    assetInfoFromNode.issueHeight.toString()
                  );
                  expect(assetInfo.id).toMatch(assetInfoFromNode.assetId);
                  expect(assetInfo.name).toMatch(assetInfoFromNode.name);
                  expect(assetInfo.precision.toString()).toMatch(
                    assetInfoFromNode.decimals.toString()
                  );
                  expect(assetInfo.quantity.toString()).toMatch(
                    assetInfoFromNode.quantity.toString()
                  );
                  expect(assetInfo.reissuable.toString()).toMatch(
                    assetInfoFromNode.reissuable.toString()
                  );
                  expect(assetInfo.sender).toMatch(assetInfoFromNode.issuer);
                  expect(assetInfo.ticker).toMatch('BTC');
                  done();
                } else {
                  done('Asset not found in Data Service');
                }
              });
          });
        }
      );
    });

    it('fetches all assets with tickers by ticker=*', () =>
      service
        .search({ ticker: '*', limit: 101, sort: SortOrder.Descending })
        .run()
        .promise()
        .then(as => {
          expect(as.data.length).toBeGreaterThan(100);
          // make sure WAVES is included
          expect(
            as.data.find(a => a.data && a.data.ticker === 'WAVES')
          ).not.toBeUndefined();
        }));
  });
});
