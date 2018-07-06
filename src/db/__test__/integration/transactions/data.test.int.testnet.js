const { Nothing } = require('folktale/maybe');

const db = require('../createDb')();

describe('Data transactions', () => {
  it('should return Maybe(data) for `one` tx correctly', done => {
    db.transactions.data
      .one('2jnH9e2KvEEAiWKHgwocD9arjK3AvBz6DbqwK8GUHdXA')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toMatchSnapshot();
          done();
        },
      });

    db.transactions.exchange
      .one('NON_EXISTING_TX')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  describe('filters', () => {
    it('key filter should work', done => {
      db.transactions.data
        .many({ key: 'testboolF' })
        .run()
        .listen({
          onResolved: mxs => {
            const xs = mxs.map(x => x.getOrElse(-1));
            expect(
              xs.every(x => x.data.find(({ key }) => key === 'testboolF'))
            ).toBe(true);
            done();
          },
        });
    });

    it('value filter should work', done => {
      db.transactions.data
        .many({ type: 'integer', value: 11 })
        .run()
        .listen({
          onResolved: mxs => {
            const xs = mxs.map(x => x.getOrElse(-1));
            expect(
              xs.every(x => x.data.find(({ value }) => parseInt(value) === 11))
            ).toBe(true);
            done();
          },
        });
    });

    xit('timeStart/timeEnd filter should work', () => {});
    xit('timeStart filter should work', () => {});
    xit('limit should work', () => {});
  });

  xdescribe('Pagination', () => {
    xit('sort should work', () => {});
    xit('after should work', () => {});
  });
});
