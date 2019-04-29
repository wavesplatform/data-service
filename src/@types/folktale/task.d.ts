declare module 'folktale/concurrency/task' {
  import { Matchable } from 'folktale';

  export type TaskPattern<A, B, C> = {
    Cancelled: () => C;
    Rejected: (a: { value: A }) => C;
    Resolved: (b: { value: B }) => C;
  };

  export interface TaskExecution<A, B> {
    cancel(): void;
    promise(): Promise<B>;

    listen(handlers: {
      onCancelled?: () => void;
      onRejected?: (a: A) => void;
      onResolved?: (b: B) => void;
    }): void;

    link<C, D>(other: TaskExecution<C, D>): TaskExecution<A, B>;
  }

  export type Computation<A, B> = (
    resolver: {
      reject: (reason: A) => void;
      resolve: (value: B) => void;
      cancel: () => void;
      cleanup: (cb: () => void) => void;
      onCancelled: (cb: () => void) => void;
      readonly isCancelled: boolean;
    }
  ) => void;

  export interface Task<A, B> extends Matchable {
    // pattern matching
    // general
    matchWith<C>(pattern: TaskPattern<A, B, C>): C;
    // task-specific
    willMatchWith<C, D>(pattern: TaskPattern<A, B, Task<C, D>>): Task<C, D>;

    and<C, D>(t: Task<C, D>): Task<A | C, [B, D]>;
    or<C, D>(t: Task<C, D>): Task<A | C, B | D>;

    map<C>(f: (b: B) => C): Task<A, C>;
    // chain<C>(f: (b: B) => Task<A, C>): Task<A, C>;
    chain<C, D>(f: (b: B) => Task<C, D>): Task<A | C, D>;
    mapRejected<C>(f: (a: A) => C): Task<C, B>;
    // checks if the current applicative contains an appropriate function
    // @todo consider using `never` instead
    apply<C, D>(
      f: Task<C, D>
    ): B extends (d: D) => infer R ? Task<C, R> : unknown;
    bimap<C, D>(lf: (a: A) => C, rf: (b: B) => D): Task<C, D>;

    orElse<C, D>(f: (a: A) => Task<C, D>): Task<C, D>;
    swap(): Task<B, A>;

    run(): TaskExecution<A, B>;
  }

  export const task: <A, B>(computation: Computation<A, B>) => Task<A, B>;
  export const of: <A, B>(value: B) => Task<A, B>;
  export const rejected: <A, B>(reason: A) => Task<A, B>;

  export const fromPromised: <A, B>(promised: () => Promise<B>) => () => Task<A, B>;

  function waitAny<A1, B1>(ts: [Task<A1, B1>]): Task<A1, [B1]>;
  function waitAny<A1, B1, A2, B2>(
    ts: [Task<A1, B1>, Task<A2, B2>]
  ): Task<A1 | A2, B1 | B2>;
  function waitAny<A1, B1, A2, B2, A3, B3>(
    ts: [Task<A1, B1>, Task<A2, B2>, Task<A3, B3>]
  ): Task<A1 | A2 | A3, B1 | B2 | B3>;
  function waitAny<A1, B1, A2, B2, A3, B3, A4, B4>(
    ts: [Task<A1, B1>, Task<A2, B2>, Task<A3, B3>, Task<A4, B4>]
  ): Task<A1 | A2 | A3 | A4, B1 | B2 | B3 | B4>;
  export function waitAny<E, V>(ts: Task<E, V>[]): Task<E, V[]>;

  function waitAll<A1, B1>(ts: [Task<A1, B1>]): Task<A1, [B1]>;
  function waitAll<A1, B1, A2, B2>(
    ts: [Task<A1, B1>, Task<A2, B2>]
  ): Task<A1 | A2, [B1, B2]>;
  function waitAll<A1, B1, A2, B2, A3, B3>(
    ts: [Task<A1, B1>, Task<A2, B2>, Task<A3, B3>]
  ): Task<A1 | A2 | A3, [B1, B2, B3]>;
  function waitAll<A1, B1, A2, B2, A3, B3, A4, B4>(
    ts: [Task<A1, B1>, Task<A2, B2>, Task<A3, B3>, Task<A4, B4>]
  ): Task<A1 | A2 | A3 | A4, [B1, B2, B3, B4]>;
  export function waitAll<E, V>(ts: Task<E, V>[]): Task<E, V[]>;

  // @todo
  // function do(...)
}
