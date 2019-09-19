import { validatePairs } from '../pairs';

import { PairOrderingServiceImpl } from '../../PairOrderingService';
import { asset, AssetInfo, ServiceMget, Asset, list } from '../../../types';
import { of as taskOf } from 'folktale/concurrency/task';

describe('Pairs validation', () => {
  const MATCHER = 'matcher';
  const WAVES = 'WAVES';
  const BTC = 'BTC';

  const pairOrderingService = new PairOrderingServiceImpl({
    [MATCHER]: [BTC, WAVES],
  });

  const assetsMget: ServiceMget<string[], Asset> = {
    mget: (assetIds: string[]) =>
      taskOf(
        list(
          assetIds.map(aid => {
            switch (aid) {
              case BTC:
              case WAVES:
                return asset({} as AssetInfo);
              default:
                return asset(null);
            }
          })
        )
      ),
  };

  const validate = validatePairs(assetsMget, pairOrderingService);

  describe('asset order validation', () => {
    it('known matcher, right order, pass', () =>
      expect(
        validate(MATCHER, [{ amountAsset: WAVES, priceAsset: BTC }])
          .run()
          .promise()
      ).resolves.not.toThrow());

    it('unknown matcher, existing assets, pass', () =>
      expect(
        validate('', [{ amountAsset: WAVES, priceAsset: BTC }])
          .run()
          .promise()
      ).resolves.not.toThrow());

    it('known matcher, wrong order, fail', () =>
      expect(
        validate(MATCHER, [{ amountAsset: BTC, priceAsset: WAVES }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());
  });

  describe('assets existence validation', () => {
    it('non-existing assets, right order, fail', () =>
      expect(
        validate(MATCHER, [{ amountAsset: 'ASSET1', priceAsset: BTC }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());

    it('non-existing assets, wrong order, fail with ordering error', () =>
      expect(
        validate(MATCHER, [{ amountAsset: 'ASSET1', priceAsset: 'ASSET2' }])
          .run()
          .promise()
      ).rejects.toMatchSnapshot());
  });
});
