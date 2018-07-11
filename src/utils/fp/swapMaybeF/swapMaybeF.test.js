const Maybe = require('folktale/maybe');
const Result = require('folktale/result');
const Task = require('folktale/concurrency/task');

const swapMaybeF = require('./');

test('swapMaybeF with Result as F', () => {
  const a = Maybe.of(Result.of(1));

  expect(swapMaybeF(Result.of, a)).toEqual(Result.of(Maybe.of(1)));
});

test('swapMaybeF with Task as F', () => {
  Task.waitAll([
    swapMaybeF(Task.of, Maybe.of(Task.of(1))),
    Task.of(Maybe.of(1)),
  ])
    .run()
    .listen({
      onResolved: xs => expect(xs[0]).toEqual(xs[1]),
    });
});
