export type NamedType<T extends string, U> = {
  __type: T;
  data: U;
};

export default <T extends string, U>(name: T, data: U): NamedType<T, U> => ({
  __type: name,
  data,
});
