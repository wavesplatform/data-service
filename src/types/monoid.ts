export type Monoid<T> = {
  concat: (a: T, b: T) => T;
  empty: T;
};
