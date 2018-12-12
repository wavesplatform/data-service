declare module 'folktale/concurrency/task' {
  export interface Matchable {
    matchWith<C>(pattern: Record<string, (...args: any[]) => C>): C;
  }

  type TaskPattern<A, B, C> = {
    Cancelled: () => C;
    Resolved: (b: B) => C;
    Rejected: (a: A) => C;
  };

  abstract class Task<A, B> implements Matchable {
    protected constructor();
    public static of<A, B>(value: B): Task<A, B>;
    public abstract matchWith<C>(pattern: TaskPattern<A, B, C>): C;

    // task methods
    public map<C>(f: (b: B) => C): Task<A, C>;
    public chain<C>(f: (b: B) => Task<A, C>): Task<A, C>;
    public mapRejected<C>(f: (a: A) => C): Task<C, B>;
    // checks if the current task contains an appropriate function
    public apply<C, D>(
      f: Task<C, D>
    ): B extends (d: D) => any ? Task<C, ReturnType<B>> : unknown;
  }

  class Cancelled<A, B> extends Task<A, B> {
    // constructor();
    public matchWith<C>(pattern: TaskPattern<A, B, C>): C;
  }

  class Resolved<A, B> extends Task<A, B> {
    constructor(value: B);
    public matchWith<C>(pattern: TaskPattern<A, B, C>): C;
  }

  class Rejected<A, B> extends Task<A, B> {
    constructor(value: B);
    public matchWith<C>(pattern: TaskPattern<A, B, C>): C;
  }

  interface TaskExecution {}

  interface Task<A, B> {
    map<C>(f: (a: A) => C): Task<A, C>;
  }
}
