import { task, rejected, waitAll } from 'folktale/concurrency/task';

type Foo = {};

const t = task<Error, number>(({ resolve, cleanup }) => {
  console.log('Computation launched');
  cleanup(() => console.log('After task finishes, clean.'));
  resolve(2);
});

const t2 = rejected<string, Foo>('2');

const tAll = waitAll([t, t2]);
