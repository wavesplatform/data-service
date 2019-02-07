const { createPgDriver } = require('../../../../db');
const loadConfig = require('../../../../loadConfig').default;
const options = loadConfig();
const create = require('../../index');

const ADDRESS = '3NAkqT9JJHLF7hZyiZ5SncWsW8SQh2duZek';

describe('Aliases', () => {
  const service = create({
    drivers: { pg: createPgDriver(options) },
    emitEvent: () => () => null,
  });

  describe('request by alias', () => {
    it('should return Alias for one correctly', done => {
      service
        .get('test-alias')
        .run()
        .listen({
          onResolved: alias => {
            expect(alias).toMatchSnapshot();
            done();
          },
        });
    });

    it('should return null for non existing alias', done => {
      service
        .get('NON_EXISTING_ALIAS')
        .run()
        .listen({
          onResolved: nullable => {
            expect(nullable).toEqual(null);
            done();
          },
        });
    });
  });

  describe('request by address', () => {
    it('should return List(Alias) if requested without showBroken', done => {
      service
        .search({ address: ADDRESS })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });

    it('should return List(Alias) if requested with showBroken', done => {
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
        });
    });
  });
});
