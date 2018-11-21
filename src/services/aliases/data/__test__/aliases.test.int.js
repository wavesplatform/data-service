const { Nothing } = require('folktale/maybe');

const { createPgDriver } = require('../../../../db');
const loadConfig = require('../../../../loadConfig');
const options = loadConfig();
const drivers = {
  pg: createPgDriver(options),
};
const create = require('../index');

const ADDRESS = '3PDSJEfqQQ8BNk7QtiwAFPq7SgyAh5kzfBy';

describe('Aliases', () => {
  const service = create({
    drivers,
    emitEvent: () => () => null,
  });

  it('should return Maybe(alias) for one correctly', done => {
    service
      .get('sexy-boys')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toMatchSnapshot();
          done();
        },
      });

    service
      .get('NON_EXISTING_ALIAS')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  describe('request by address', () => {
    it('should return correct data if requested without showBroken', done => {
      service
        .mget({ address: ADDRESS })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });

    it('should return correct data if requested with showBroken', done => {
      service
        .mget({
          address: ADDRESS,
          showBroken: true,
        })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });
  });
});
