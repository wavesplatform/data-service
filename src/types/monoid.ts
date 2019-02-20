export type MonoidType<T> = {
  concat: (a: T, b: T) => T;
  empty: T | null;
};

export const monoid = <T>(props: MonoidType<T>) => ({
  concat: props.concat,
  empty: props.empty,
});
