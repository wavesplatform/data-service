export type Serializable<T extends string, U> = {
  __type: T;
  data: U | null;
};

export type Transform<U, S extends Serializable<string, U>> = (data: U) => S;

export type FromSerializable<
  T extends Serializable<string, any>
> = T extends Serializable<string, infer R> ? R : never;

export type FromSerializableType<
  T extends Serializable<string, any>
> = T extends Serializable<infer R, any> ? R : never;

export const toSerializable = <T extends string, U>(
  name: T,
  data: U | null
): Serializable<T, U> => ({
  __type: name,
  data: data === null ? null : data,
});
