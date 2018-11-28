const { round, floor, ceil, add, subtract } = require('../date');

const Interval = require('../../types/Interval');

describe('date helper functions', () => {
  describe('arithmetic functions', () => {
    const d = new Date('2018-11-22T17:55:46.045Z');

    it('add interval to date', () => {
      expect(add(Interval('3m'), d)).toEqual(
        new Date('2018-11-22T17:58:46.045Z')
      );
      expect(add(Interval('3h'), d)).toEqual(
        new Date('2018-11-22T20:55:46.045Z')
      );
    });

    it('subtract interval from date', () => {
      expect(subtract(Interval('3m'), d)).toEqual(
        new Date('2018-11-22T17:52:46.045Z')
      );
      expect(subtract(Interval('3h'), d)).toEqual(
        new Date('2018-11-22T14:55:46.045Z')
      );
    });
  });

  describe('round functions', () => {
    describe('should round down to a minute', () => {
      const i = Interval('1m');
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

    describe('should round down to a minute', () => {
      const i = Interval('1h');
      const d = new Date('2018-11-22T23:55:46.045Z');

      it('with floor/ceil', () => {
        expect(ceil(i, d)).toEqual(new Date('2018-11-23T00:00:00.000Z'));
        expect(floor(i, d)).toEqual(new Date('2018-11-22T23:00:00.000Z'));
      });

      it('with round, up', () => {
        expect(round(i, d)).toEqual(new Date('2018-11-23T00:00:00.000Z'));
      });
      it('with round, down', () => {
        const d2 = new Date('2018-11-22T23:25:46.045Z');
        expect(round(i, d2)).toEqual(new Date('2018-11-22T23:00:00.000Z'));
      });
    });
  });
});
