const AppError = require('./AppError');

const errorTypes = ['Resolver', 'Db', 'Validation'];

// spec
describe('AppError', () => {
  errorTypes.forEach(type => {
    it(`${type} should be created from message`, () => {
      AppError[type]('Error message', { info: 'some-info' }).matchWith({
        [type]: err => {
          expect(err.error.message).toEqual('Error message');
          expect(err.meta.info).toEqual('some-info');
        },
      });
    });

    it(`${type} should be created from Error object`, () => {
      AppError[type](new Error('Error message'), {
        info: 'some-info',
      }).matchWith({
        [type]: err => {
          expect(err.error.message).toEqual('Error message');
          expect(err.meta.info).toEqual('some-info');
        },
      });
    });
  });
});
