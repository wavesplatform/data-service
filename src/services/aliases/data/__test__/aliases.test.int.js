const { createPgDriver } = require('../../../../db');
const { loadConfig } = require('../../../../loadConfig');
const options = loadConfig();
const create = require('../..').default;

const ADDRESS = '3PDSJEfqQQ8BNk7QtiwAFPq7SgyAh5kzfBy';

describe('Aliases', () => {
  const service = create({
    drivers: { pg: createPgDriver(options) },
    emitEvent: () => () => null,
  });

  describe('request by alias', () => {
    it('should return Maybe(alias) for one correctly', done => {
      service
        .get('sexy-boys')
        .run()
        .listen({
          onResolved: maybeX => {
            expect(maybeX.unsafeGet()).toMatchSnapshot();
            done();
          },
          onRejected: done.fail,
        });
    });

    it('should return null for non existing alias', done => {
      service
        .get('NON_EXISTING_ALIAS')
        .run()
        .listen({
          onResolved: maybeX => {
            expect(maybeX).toBeNothing();
            done();
          },
          onRejected: done.fail,
        });
    });
  });

  describe('request by address', () => {
    it('should return correct data if requested without showBroken', done => {
      service
        .search({ address: ADDRESS })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
          onRejected: done.fail,
        });
    });

    it('should return correct data if requested with showBroken', done => {
      service
        .search({
          address: ADDRESS,
          showBroken: true,
        })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
          onRejected: done.fail,
        });
    });
  });
});
