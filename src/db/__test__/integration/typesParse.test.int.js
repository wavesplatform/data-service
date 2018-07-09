const { BigNumber } = require('@waves/data-entities');

const loadConfig = require('../../../loadConfig');
const { pg: createDriverT } = require('../../driver');

const dbT = createDriverT(loadConfig());

const q = fn =>
  dbT
    .one('select * from test_types')
    .run()
    .listen({
      onResolved: fn,
      onRejected: console.error, // eslint-disable-line
    });

xdescribe('Type parsing should convert to BigNumber', () => {
  it('bigint', done =>
    q(({ i8: x }) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9223372036854775807'));
      done();
    }));

  it('float', done =>
    q(({ f4: x }) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9.22337203685478'));
      done();
    }));

  it('double precision', done =>
    q(({ f8: x }) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9.22337203685478'));
      done();
    }));

  it('numeric', done =>
    q(({ n: x }) => {
      expect(x instanceof BigNumber).toBe(true);
      expect(x).toEqual(new BigNumber('9223372036854775804'));
      done();
    }));

  it('array/bigint', done =>
    q(({ i8a: xs }) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9223372036854775803'),
        new BigNumber('9223372036854775802'),
      ]);
      done();
    }));

  it('array/float', done =>
    q(({ f4a: xs }) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9.22337203685478'),
        new BigNumber('9.22337203685478'),
      ]);
      done();
    }));

  it('array/double precision', done =>
    q(({ f8a: xs }) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9.22337203685478'),
        new BigNumber('9.22337203685478'),
      ]);
      done();
    }));

  it('array/numeric', done =>
    q(({ na: xs }) => {
      xs.forEach(x => expect(x instanceof BigNumber).toBe(true));

      expect(xs).toEqual([
        new BigNumber('9223372036854775797'),
        new BigNumber('9223372036854775796'),
      ]);
      done();
    }));
});
