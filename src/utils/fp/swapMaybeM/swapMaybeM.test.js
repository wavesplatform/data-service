const Maybe = require('folktale/maybe');
const Result = require('folktale/result');
const Task = require('folktale/concurrency/task');

const swapMaybeM = require('./');

test('swapMaybeM with Result as M', () => {
  const a = Maybe.of(Result.of(1));

  expect(swapMaybeM(Result.of, a)).toEqual(Result.of(Maybe.of(1)));
});

test('swapMaybeM with Task as M', () => {
  Task.waitAll([
    swapMaybeM(Task.of, Maybe.of(Task.of(1))),
    Task.of(Maybe.of(1)),
  ])
    .run()
    .listen({
      onResolved: xs => expect(xs[0]).toEqual(xs[1]),
    });
});
