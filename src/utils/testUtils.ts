import { Result } from 'folktale/result';

export const unsafeGetFromResult = <L, R>(r: Result<L, R>): R =>
  r.matchWith({
    Error: e => {
      throw e;
    },
    Ok: ({ value }) => value,
  });
