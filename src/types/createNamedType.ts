export type NamedType<T> = {
  __type: string;
  data: T | null;
};

export type NamedTypeFactory<T> = (v?: T | null) => NamedType<T>;

export default <T>(name: string, defaultData: T | null = null) => (
  data = defaultData
): NamedType<T> => ({
  __type: name,
  data,
});
