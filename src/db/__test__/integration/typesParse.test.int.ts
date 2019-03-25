import { BigNumber } from '@waves/data-entities';

import { loadConfig } from '../../../loadConfig';
import { createPgDriver } from '../../driver';

const dbT = createPgDriver(loadConfig());

type BigNumberArray = BigNumber[];
type BigNumberResult = Record<string, BigNumber>;
type BigNumberArrayResult = Record<string, BigNumberArray>;

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

  xit('float', done =>
    q('HERE MUST BE QUERY', ({ f4: x }: BigNumberResult) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9.22337203685478'));
      done();
    }));

  xit('double precision', done =>
    q('HERE MUST BE QUERY', ({ f8: x }: BigNumberResult) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9.22337203685478'));
      done();
    }));

  it('numeric', done =>
    q(
      `select * from candles where time_start < '2017-05-01' and interval_in_secs=21600 order by time_start, amount_asset_id limit 1`,
      ({ close: x }: BigNumberResult) => {
        expect(x instanceof BigNumber).toBe(true);
        expect(x).toEqual(new BigNumber('0.13'));
        done();
      }
    ));

  xit('array/bigint', done =>
    q('HERE MUST BE QUERY', ({ i8a: xs }: BigNumberArrayResult) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9223372036854775803'),
        new BigNumber('9223372036854775802'),
      ]);
      done();
    }));

  xit('array/float', done =>
    q('HERE MUST BE QUERY', ({ f4a: xs }: BigNumberArrayResult) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9.22337203685478'),
        new BigNumber('9.22337203685478'),
      ]);
      done();
    }));

  xit('array/double precision', done =>
    q('HERE MUST BE QUERY', ({ f8a: xs }: BigNumberArrayResult) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9.22337203685478'),
        new BigNumber('9.22337203685478'),
      ]);
      done();
    }));

  xit('array/numeric', done =>
    q('HERE MUST BE QUERY', ({ na: xs }: BigNumberArrayResult) => {
      xs.forEach((x: BigNumber) => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9223372036854775797'),
        new BigNumber('9223372036854775796'),
      ]);
      done();
    }));
});
