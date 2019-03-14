export type Serializable<T extends string, U> = {
  __type: T;
  data: U;
};

export type FromSerializable<T extends Serializable<string, any>> = T extends Serializable<
  string,
  infer R
>
  ? R
  : never;

export const toSerializable = <T extends string, U>(name: T, data: U): Serializable<T, U> => ({
  __type: name,
  data,
});
