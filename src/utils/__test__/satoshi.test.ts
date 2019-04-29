import { BigNumber } from '@waves/data-entities';

import { convertAmount, convertPrice } from '../satoshi';

test('convertAmount should multiply by 10^-decimals', () => {
  expect(convertAmount(8, new BigNumber(100000000))).toEqual(new BigNumber(1));
  expect(convertAmount(2, new BigNumber(1234))).toEqual(new BigNumber(12.34));
  expect(convertAmount(2, new BigNumber(0))).toEqual(new BigNumber(0));
  expect(convertAmount(0, new BigNumber(1))).toEqual(new BigNumber(1));
});

test('convertPrice should multiply by 10^-8 + aDecimals - pDecimals', () => {
  expect(convertPrice(8, 8, new BigNumber(100000000))).toEqual(
    new BigNumber(1)
  );
  expect(convertPrice(8, 2, new BigNumber(100))).toEqual(new BigNumber(1));
  expect(convertPrice(8, 0, new BigNumber(100))).toEqual(new BigNumber(100));
});

test('functions should not fail on corner cases', () => {
  expect(convertAmount(0, new BigNumber(NaN))).toEqual(new BigNumber(NaN));
  expect(convertAmount(0, new BigNumber(Infinity))).toEqual(
    new BigNumber(Infinity)
  );

  expect(convertPrice(0, 0, new BigNumber(NaN))).toEqual(new BigNumber(NaN));
  expect(convertPrice(0, 0, new BigNumber(Infinity))).toEqual(
    new BigNumber(Infinity)
  );
});
