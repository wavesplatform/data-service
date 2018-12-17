import { Static } from 'ramda';
import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { Result } from 'folktale/result';

declare module 'ramda' {
  type RightType<F> = F extends Maybe<infer R>
    ? R
    : F extends Result<any, infer R>
    ? R
    : F extends Task<any, infer R>
    ? R
    : never;

  type LeftType<F> = F extends Result<infer L, any>
    ? L
    : F extends Task<infer L, any>
    ? L
    : never;

  interface Static {
    // Maybe
    map<F extends Maybe<any>, U>(
      fn: (value: RightType<F>) => U,
      maybe: F
    ): Maybe<U>;
    map<F extends Maybe<any>, U>(
      fn: (value: RightType<F>) => U
    ): (maybe: F) => Maybe<U>;
    map<T, U>(fn: (value: T) => U, maybe: Maybe<T>): Maybe<U>;
    map<T, U>(fn: (value: T) => U): (maybe: Maybe<T>) => Maybe<U>;

    chain<F extends Maybe<any>, U>(
      fn: (value: RightType<F>) => Maybe<U>,
      maybe: F
    ): Maybe<U>;
    chain<F extends Maybe<any>, U>(
      fn: (value: RightType<F>) => Maybe<U>
    ): (maybe: F) => Maybe<U>;
    chain<T, U>(fn: (value: T) => Maybe<U>, maybe: Maybe<T>): Maybe<U>;
    chain<T, U>(fn: (value: T) => Maybe<U>): (maybe: Maybe<T>) => Maybe<U>;

    // Result
    map<F extends Result<any, any>, U>(
      fn: (value: RightType<F>) => U,
      result: F
    ): Result<LeftType<F>, U>;
    map<F extends Result<any, any>, U>(
      fn: (value: RightType<F>) => U
    ): (result: F) => Result<LeftType<F>, U>;
    map<E, T, U>(fn: (value: T) => U, result: Result<E, T>): Result<E, U>;
    map<E, T, U>(fn: (value: T) => U): (result: Result<E, T>) => Result<E, U>;

    chain<F extends Result<any, any>, U>(
      fn: (value: RightType<F>) => Result<LeftType<F>, U>,
      result: F
    ): Result<LeftType<F>, U>;
    chain<F extends Result<any, any>, U>(
      fn: (value: RightType<F>) => Result<LeftType<F>, U>
    ): (result: F) => Result<LeftType<F>, U>;
    chain<E, T, U>(
      fn: (value: T) => Result<E, U>,
      result: Result<E, T>
    ): Result<E, U>;
    chain<E, T, U>(
      fn: (value: T) => Result<E, U>
    ): (result: Result<E, T>) => Result<E, U>;

    // Task
    map<F extends Task<any, any>, U>(
      fn: (value: RightType<F>) => U,
      task: F
    ): Task<LeftType<F>, U>;
    map<F extends Task<any, any>, U>(
      fn: (value: RightType<F>) => U
    ): (task: F) => Task<LeftType<F>, U>;
    map<E, T, U>(fn: (value: T) => U, task: Task<E, T>): Task<E, U>;
    map<E, T, U>(fn: (value: T) => U): (task: Task<E, T>) => Task<E, U>;

    chain<F extends Task<any, any>, U>(
      fn: (value: RightType<F>) => Task<LeftType<F>, U>,
      task: F
    ): Task<LeftType<F>, U>;
    chain<F extends Task<any, any>, U>(
      fn: (value: RightType<F>) => Task<LeftType<F>, U>
    ): (task: F) => Task<LeftType<F>, U>;
    chain<E, T, U>(fn: (value: T) => Task<E, U>, task: Task<E, T>): Task<E, U>;
    chain<E, T, U>(
      fn: (value: T) => Task<E, U>
    ): (task: Task<E, T>) => Task<E, U>;
  }
}
