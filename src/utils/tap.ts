import { curryN } from 'ramda';

export const tap: {
  <A>(fn: (a: A) => any, a: A): A;
  <A>(fn: (a: A) => any): (a: A) => A;
} = curryN(2, (fn, x) => {
  fn(x);
  return x;
});
