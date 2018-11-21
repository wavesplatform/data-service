const { Nothing } = require('folktale/maybe');

const { createPgDriver } = require('../../../../db');
const loadConfig = require('../../../../loadConfig');
const options = loadConfig();
const create = require('../index');

const ADDRESS = '3NAkqT9JJHLF7hZyiZ5SncWsW8SQh2duZek';

describe('Aliases', () => {
  const service = create({
    pg: createPgDriver(options),
    emitEvent: () => () => null,
  });

  it('should return Maybe(alias) for one correctly', done => {
    service
      .get('test-alias')
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
