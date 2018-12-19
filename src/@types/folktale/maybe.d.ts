declare module 'folktale/maybe' {
  import { Matchable, Semigroup } from 'folktale';

  export type MaybePattern<A, B> = {
    Nothing: () => B;
    Just: (a: { value: A }) => B;
  };

  export interface Maybe<A> extends Matchable {
    // pattern matching
    matchWith<B>(pattern: MaybePattern<A, B>): B;

    map<B>(f: (a: A) => B): Maybe<B>;
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    // checks if the current applicative contains an appropriate function
    // @todo consider using `never` instead
    apply<B>(f: Maybe<B>): A extends (b: B) => infer R ? Maybe<R> : unknown;

    // extracting values
    getOrElse<B>(b: B): A | B;
    unsafeGet(): A;

    orElse(f: () => Maybe<A>): Maybe<A>;
    or(m: Maybe<A>): Maybe<A>;

    concat(m: Maybe<A>): A extends Semigroup<any> ? Maybe<A> : unknown;

    fold<B>(l: () => B, r: (a: A) => B): B;

    filter<B extends A>(pred: (a: A) => a is B): Maybe<B>;
    filter(pred: (a: A) => boolean): Maybe<A>;
  }

  export const of: <A>(value: A) => Maybe<A>;
  export const empty: <A>() => Maybe<A>;
  export const fromNullable: <A>(a: A | null | undefined) => Maybe<A>;
}
