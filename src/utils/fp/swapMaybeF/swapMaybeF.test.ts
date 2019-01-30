import { of as maybeOf } from 'folktale/maybe';
import { of as resultOf } from 'folktale/result';
import { of as taskOf, waitAll } from 'folktale/concurrency/task';
import { swapMaybeF } from '.';

test('swapMaybeF with Result as F', () => {
  const a = maybeOf(resultOf(1));

  expect(swapMaybeF(resultOf, a)).toEqual(resultOf(maybeOf(1)));
});

test('swapMaybeF with Task as F', () => {
  waitAll([swapMaybeF(taskOf, maybeOf(taskOf(1))), taskOf(maybeOf(1))])
    .run()
    .listen({
      onResolved: xs => expect(xs[0]).toEqual(xs[1]),
    });
});
