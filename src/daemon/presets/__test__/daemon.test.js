const { daemon } = require('../daemon');

const Task = require('folktale/concurrency/task');

const createLogger = () => {
  return {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  };
};

describe('Preset for create daemon', () => {
  it('should throw exception if no loop', done => {
    let logger = createLogger();
    let init = jest.fn(() => Task.of());

    try {
      daemon({ init }, { test: 1 }, 1000, 2000, logger);
    } catch (e) {
      expect(e.toString()).toEqual('[DAEMON] stoped but ');
      expect(logger.error).toBeCalledWith({ message: '[DAEMON] loop not provided' });
      done();
    }
  });

  it('should warn if no init', done => {
    let logger = createLogger();
    let loop = jest.fn(() => Task.of());

    let d = daemon({ loop }, { conf: 'qwerty' }, 1000, 2000, logger).listen({
      onCancelled: () => {
        expect(logger.warn).toBeCalledWith({ message: '[DAEMON] init not provided' });
        expect(logger.error).toBeCalledWith({
          message: `[DAEMON] start loop canceled`,
        });
        expect(loop).toBeCalledWith({ conf: 'qwerty' });
        done();
      },
    });

    setTimeout(() => d.cancel(), 20);
  });

  // same as test 1
  it('should stop if no init and no loop', done => {
    let logger = createLogger();

    try {
      daemon({}, {}, 1000, 2000, logger).listen({});
      throw 'Must be thrown';
    } catch (e) {
      expect(e.toString()).toEqual('[DAEMON] stoped but must never');
      expect(logger.warn).toBeCalledWith({ message: '[DAEMON] init not provided' });
      expect(logger.warn).toBeCalledWith({ message: '[DAEMON] loop not provided' });
      done();
    }
  });

  it('should run loop 5 time with interval=5ms, timeout=20ms, loop=min, stop=28', done => {
    let loop = jest.fn(() => Task.of());
    let logger = createLogger();

    let d = daemon({ loop }, {}, 5, 20, logger).listen(
      {
        onCancelled: () => {
          expect(logger.warn).toBeCalledWith({
            message: '[DAEMON] init not provided',
          });
          expect(logger.error).toBeCalledWith({
            message: `[DAEMON] start loop canceled`,
          });
          expect(loop).toHaveBeenCalledTimes(6);
          done();
        },
      }
    );

    setTimeout(() => d.cancel(), 29);
  });

  it('should run loop 2 time with interval=5ms, timeout=20ms, loop=10ms, stop=28', done => {
    let loop = jest.fn(() =>
      Task.task(resolver => setTimeout(() => resolver.resolve(), 10))
    );
    let logger = createLogger();

    let d = daemon({ loop }, {}, 5, 20, logger).listen(
      {
        onCancelled: () => {
          expect(logger.warn).toBeCalledWith({
            message: '[DAEMON] init not provided',
          });
          expect(logger.error).toBeCalledWith({
            message: `[DAEMON] start loop canceled`,
          });
          expect(loop).toHaveBeenCalledTimes(3);
          done();
        },
      }
    );

    setTimeout(() => d.cancel(), 28);
  });

  // it('should run loop 2 time with interval=5ms, timeout=10ms, loop=20ms, stop=28', done => {
  //   let loop = jest.fn(() =>
  //     Task.task(resolver => setTimeout(resolver.resolve, 10000))
  //   );
  //   let logger = createLogger();

  //   try {
  //     daemon({ loop }, {}, 5, 10, logger);
  //     // throw 'Must be thrown';
  //   } catch (e) {
  //     console.log('!!!!@@@@@');
  //     // expect(e.toString()).toEqual('[DAEMON] timeout expired');
  //     expect(loop).toHaveBeenCalledTimes(1);
  //     done();
  //   }
  // });
});
