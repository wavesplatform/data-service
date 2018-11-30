const { daemon } = require('../daemon');

const Task = require('folktale/concurrency/task');

describe('Preset for create daemon', () => {
  it('should warning if no loop', done => {
    let warn = jest.fn();
    let init = jest.fn(() => Task.of());

    try {
      daemon({ init }, { test: 1 }, 1000, 2000, { warn, info: () => {} });
      throw 'Must be thrown';
    } catch (e) {
      expect(e.toString()).toEqual('[DAEMON] stoped but must never');
      expect(warn).toBeCalledWith({ message: '[DAEMON] loop not provided' });
      done();
    }
  });

  it('should warning if no init', done => {
    let warn = jest.fn();
    let error = jest.fn();
    let loop = jest.fn(() => Task.of());

    let d = daemon({ loop }, { conf: 'qwerty' }, 1000, 2000, {
      warn,
      error,
      info: () => {},
    }).listen({
      onCancelled: () => {
        expect(warn).toBeCalledWith({ message: '[DAEMON] init not provided' });
        expect(error).toBeCalledWith({
          message: `[DAEMON] start loop canceled`,
        });
        expect(loop).toBeCalledWith({ conf: 'qwerty' });
        done();
      },
    });

    setTimeout(() => d.cancel(), 20);
  });

  it('should stop if no init and no loop', done => {
    let warn = jest.fn();

    try {
      daemon({}, {}, 1000, 2000, { warn, info: () => {} }).listen({});
      throw 'Must be thrown';
    } catch (e) {
      expect(e.toString()).toEqual('[DAEMON] stoped but must never');
      expect(warn).toBeCalledWith({ message: '[DAEMON] init not provided' });
      expect(warn).toBeCalledWith({ message: '[DAEMON] loop not provided' });
      done();
    }
  });

  it('should run loop 5 time with interval=5ms, timeout=20ms, loop=min, stop=28', done => {
    let loop = jest.fn(() => Task.of());
    let warn = jest.fn();
    let error = jest.fn();

    let d = daemon({ loop }, {}, 5, 20, { info: () => {}, warn, error }).listen(
      {
        onCancelled: () => {
          expect(warn).toBeCalledWith({
            message: '[DAEMON] init not provided',
          });
          expect(error).toBeCalledWith({
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

    let warn = jest.fn();
    let error = jest.fn();

    let d = daemon({ loop }, {}, 5, 20, { info: () => {}, warn, error }).listen(
      {
        onCancelled: () => {
          expect(warn).toBeCalledWith({
            message: '[DAEMON] init not provided',
          });
          expect(error).toBeCalledWith({
            message: `[DAEMON] start loop canceled`,
          });
          expect(loop).toHaveBeenCalledTimes(3);
          done();
        },
      }
    );

    setTimeout(() => d.cancel(), 28);
  });

  it('should run loop 2 time with interval=5ms, timeout=10ms, loop=12ms, stop=28', done => {
    let loop = jest.fn(() =>
      Task.task(resolver =>
        setTimeout(
          () => (!resolver.isCancelled ? resolver.resolve() : true),
          12
        )
      )
    );

    let warn = jest.fn();
    let error = jest.fn();

    let d = daemon({ loop }, {}, 5, 10, { info: () => {}, warn, error }).listen(
      {
        onCancelled: () => {
          expect(warn).toBeCalledWith({
            message: '[DAEMON] init not provided',
          });
          expect(error).toBeCalledWith({
            message: `[DAEMON] start loop canceled`,
          });
          expect(loop).toHaveBeenCalledTimes(3);
          done();
        },
      }
    );

    setTimeout(() => d.cancel(), 28);
  });
});
