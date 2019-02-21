export type Monoid<T> = {
  concat: (a: T, b: T) => T;
  empty: T;
};

export const monoid = <T>(props: Monoid<T>) => ({
  concat: props.concat,
  empty: props.empty,
});
