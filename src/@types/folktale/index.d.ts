declare module 'folktale' {
  export interface Matchable {
    matchWith<C>(pattern: Record<string, (...args: any[]) => C>): C;
  }

  export interface Semigroup<A> {
    concat(a: Semigroup<A>): Semigroup<A>;
  }
}
