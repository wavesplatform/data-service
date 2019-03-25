declare module 'folktale/result' {
  import { Matchable, Semigroup } from 'folktale';

  export type ResultPattern<A, B, C> = {
    Error: (a: { value: A }) => C;
    Ok: (b: { value: B }) => C;
  };

  export interface Result<A, B> extends Matchable {
    matchWith<C>(pattern: ResultPattern<A, B, C>): C;

    map<C>(f: (b: B) => C): Result<A, C>;
    chain<C, D>(f: (b: B) => Result<C, D>): Result<A | C, D>;
    mapError<C>(f: (a: A) => C): Result<C, B>;
    // checks if the current applicative contains an appropriate function
    // @todo consider using `never` instead
    apply<C, D>(
      f: Result<C, D>
    ): B extends (d: D) => infer R ? Result<C, R> : unknown;
    bimap<C, D>(lf: (a: A) => C, rf: (b: B) => D): Result<C, D>;

    // extracting values
    getOrElse<C>(c: C): B | C;
    unsafeGet(): B;

    orElse<C, D>(f: (a: A) => Result<C, D>): Result<C, D>;
    swap(): Result<B, A>;

    concat(m: Result<A, B>): B extends Semigroup<any> ? Result<A, B> : unknown;

    fold<C>(l: (a: A) => B, r: (b: B) => C): C;

    filter<C extends B>(pred: (b: B) => b is C): Result<A, C>;
    filter(pred: (b: B) => boolean): Result<A, B>;
  }

  export const of: <A, B>(value: B) => Result<A, B>;
  export const Error: <A, B>(error: A) => Result<A, B>;
  export const Ok: <A, B>(value: B) => Result<A, B>;
}
