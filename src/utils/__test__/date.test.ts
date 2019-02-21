import { round, floor, ceil, add, subtract } from '../date';
import { interval } from '../../types';

describe('date helper functions', () => {
  describe('arithmetic functions', () => {
    const d = new Date('2018-11-22T17:55:46.045Z');

    it('add interval to date', () => {
      expect(add(interval('3m').unsafeGet(), d)).toEqual(
        new Date('2018-11-22T17:58:46.045Z')
      );
      expect(add(interval('3h').unsafeGet(), d)).toEqual(
        new Date('2018-11-22T20:55:46.045Z')
      );
    });

    it('subtract interval from date', () => {
      expect(subtract(interval('3m').unsafeGet(), d)).toEqual(
        new Date('2018-11-22T17:52:46.045Z')
      );
      expect(subtract(interval('3h').unsafeGet(), d)).toEqual(
        new Date('2018-11-22T14:55:46.045Z')
      );
    });
  });

  describe('round functions', () => {
    describe('should round down to a minute', () => {
      const i = interval('1m').unsafeGet();
      const d = new Date('2018-11-22T17:55:46.045Z');

      it('with floor/ceil', () => {
        expect(ceil(i, d)).toEqual(new Date('2018-11-22T17:56:00.000Z'));
        expect(floor(i, d)).toEqual(new Date('2018-11-22T17:55:00.000Z'));
      });

      it('with round, up', () => {
        expect(round(i, d)).toEqual(new Date('2018-11-22T17:56:00.000Z'));
      });

      it('with round, down', () => {
        const d2 = new Date('2018-11-22T17:55:26.045Z');
        expect(round(i, d2)).toEqual(new Date('2018-11-22T17:55:00.000Z'));
      });
    });

    describe('should round down to a hour', () => {
      const i = interval('1h').unsafeGet();
      const d = new Date('2018-11-22T23:55:46.045+00:00');

      it('with floor/ceil', () => {
        expect(ceil(i, d)).toEqual(new Date('2018-11-23T00:00:00.000+00:00'));
        expect(floor(i, d)).toEqual(new Date('2018-11-22T23:00:00.000+00:00'));
      });

      it('with round, up', () => {
        expect(round(i, d)).toEqual(new Date('2018-11-23T00:00:00.000+00:00'));
      });
      it('with round, down', () => {
        const d2 = new Date('2018-11-22T23:25:46.045Z');
        expect(round(i, d2)).toEqual(new Date('2018-11-22T23:00:00.000+00:00'));
      });
    });

    describe('should round down to a month', () => {
      const i = interval('1M').unsafeGet();
      const d = new Date('2018-11-22T23:55:46.045Z');

      it('with floor/ceil', () => {
        expect(ceil(i, d)).toEqual(new Date('2018-12-01T00:00:00.000Z'));
        expect(floor(i, d)).toEqual(new Date('2018-11-01T00:00:00.000Z'));
      });

      it('with round, up', () => {
        expect(round(i, d)).toEqual(new Date('2018-12-01T00:00:00.000Z'));
      });

      it('with round, down', () => {
        expect(floor(i, d)).toEqual(new Date('2018-11-01T00:00:00.000Z'));
      });
    });

    describe('should round down to a year', () => {
      const i = interval('1Y').unsafeGet();
      const d = new Date('2018-11-22T23:55:46.045Z');

      it('with floor/ceil', () => {
        expect(ceil(i, d)).toEqual(new Date('2019-01-01T00:00:00.000Z'));
        expect(floor(i, d)).toEqual(new Date('2018-01-01T00:00:00.000Z'));
      });

      it('with round, up', () => {
        expect(round(i, d)).toEqual(new Date('2019-01-01T00:00:00.000Z'));
      });

      it('with round, down', () => {
        expect(floor(i, d)).toEqual(new Date('2018-01-01T00:00:00.000Z'));
      });
    });
  });
});
