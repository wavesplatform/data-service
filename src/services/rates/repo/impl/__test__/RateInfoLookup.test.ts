import { Asset, BigNumber } from '@waves/data-entities';
import { empty } from 'folktale/maybe';

import { MoneyFormat } from '../../../../types';
import RateInfoLookup from '../RateInfoLookup';

describe('RateInfoLookup', () => {
  describe('get', () => {
    it('should get rate exactly for requested pair', () => {
      const amountAsset = new Asset({
        id: 'WAVES',
        name: 'Waves',
        description: '',
        precision: 8,
        height: 0,
        timestamp: new Date(),
        sender: '',
        quantity: 100,
        reissuable: false,
        minSponsoredFee: 0,
        hasScript: false,
      });
      const baseAsset = new Asset({
        id: 'USDN',
        name: 'USDN',
        description: '',
        precision: 6,
        height: 1,
        timestamp: new Date(),
        sender: '',
        quantity: 100,
        reissuable: false,
        minSponsoredFee: 0,
        hasScript: false,
      });

      const data = [
        {
          amountAsset: amountAsset,
          priceAsset: baseAsset,
          rate: new BigNumber(10),
          volumeWaves: new BigNumber(100),
        },
      ];

      const lookup = new RateInfoLookup(data, empty(), baseAsset);

      const request = {
        amountAsset: baseAsset,
        priceAsset: amountAsset,
        moneyFormat: MoneyFormat.Long,
      };
      const rate = lookup.get(request).getOrElse(undefined);

      expect(rate).toBeDefined();
      expect(rate?.amountAsset.id).toEqual(request.amountAsset.id);
      expect(rate?.priceAsset.id).toEqual(request.priceAsset.id);
    });
  });
});
