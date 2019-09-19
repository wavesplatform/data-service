const http = require('http');
const json = require('@waves/json-bigint');

import createService, { createCache } from '../index';

// dependencies
import { createPgDriver } from '../../../db';
import { loadConfig } from '../../../loadConfig';
import { EventEmitter } from 'events';

const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const cache = createCache(10, 10000);

const service = createService({
  drivers,
  emitEvent: () => () => null,
  cache,
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
        .search({ ticker: 'WAVES' })
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
            const assetInfoFromNode: any = json.parse(data);
            service
              .search({ ticker: 'BTC' })
              .run()
              .promise()
              .then(xs => {
                expect(xs.data[0].data).toMatchObject({
                  description: assetInfoFromNode.description,
                  height: assetInfoFromNode.issueHeight,
                  id: assetInfoFromNode.assetId,
                  name: assetInfoFromNode.name,
                  precision: assetInfoFromNode.decimals,
                  quantity: assetInfoFromNode.quantity,
                  reissuable: assetInfoFromNode.reissuable,
                  sender: assetInfoFromNode.issuer,
                  ticker: 'BTC',
                });
                done();
              });
          });
        }
      );
    });

    it('fetches all assets with tickers by ticker=*', () =>
      service
        .search({ ticker: '*' })
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
