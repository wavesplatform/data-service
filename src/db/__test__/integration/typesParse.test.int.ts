import { BigNumber } from '@waves/data-entities';

import { loadConfig } from '../../../loadConfig';
import { createPgDriver } from '../../driver';

const dbT = createPgDriver(loadConfig());

// type BigNumberArray = BigNumber[];
type BigNumberResult = Record<string, BigNumber>;
// type BigNumberArrayResult = Record<string, BigNumberArray>;

const q = <T>(query: string, fn: (data: T) => void) =>
  dbT
    .one<T>(query)
    .run()
    .listen({
      onResolved: fn,
      onRejected: console.error, // eslint-disable-line
    });

describe('Type parsing should convert to BigNumber', () => {
  it('bigint', done =>
    q(
      'select * from txs_1 order by id limit 1',
      ({ amount: x }: BigNumberResult) => {
        expect(x instanceof BigNumber).toBe(true);
        expect(x).toEqual(new BigNumber('100000000'));
        done();
      }
    ));

  // it('float', done =>
  //   q(({ f4: x }: BigNumberResult) => {
  //     expect(x instanceof BigNumber).toBe(true);
  //     expect(x).toEqual(new BigNumber('9.22337203685478'));
  //     done();
  //   }));

  // it('double precision', done =>
  //   q(({ f8: x }: BigNumberResult) => {
  //     expect(x instanceof BigNumber).toBe(true);
  //     expect(x).toEqual(new BigNumber('9.22337203685478'));
  //     done();
  //   }));

  it('numeric', done =>
    q(
      `select * from candles where time_start < '2017-05-01' and interval_in_secs=21600 order by time_start, amount_asset_id limit 1`,
      ({ close: x }: BigNumberResult) => {
        expect(x instanceof BigNumber).toBe(true);
        expect(x).toEqual(new BigNumber('0.13'));
        done();
      }
    ));

  // it('array/bigint', done =>
  //   q(({ i8a: xs }: BigNumberArrayResult) => {
  //     xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

  //     expect(xs).toEqual([
  //       new BigNumber('9223372036854775803'),
  //       new BigNumber('9223372036854775802'),
  //     ]);
  //     done();
  //   }));

  // it('array/float', done =>
  //   q(({ f4a: xs }: BigNumberArrayResult) => {
  //     xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

  //     expect(xs).toEqual([
  //       new BigNumber('9.22337203685478'),
  //       new BigNumber('9.22337203685478'),
  //     ]);
  //     done();
  //   }));

  // it('array/double precision', done =>
  //   q(({ f8a: xs }: BigNumberArrayResult) => {
  //     xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

  //     expect(xs).toEqual([
  //       new BigNumber('9.22337203685478'),
  //       new BigNumber('9.22337203685478'),
  //     ]);
  //     done();
  //   }));

  // it('array/numeric', done =>
  //   q(({ na: xs }: BigNumberArrayResult) => {
  //     xs.forEach((x: BigNumber) => expect(x instanceof BigNumber).toBe(true));

  //     expect(xs).toEqual([
  //       new BigNumber('9223372036854775797'),
  //       new BigNumber('9223372036854775796'),
  //     ]);
  //     done();
  //   }));
});
