import { Monoid } from 'types/monoid';

export const concatAll = <T>(monoid: Monoid<T>) => (list: T[]): T => {
  return list.reduce(monoid.concat, monoid.empty);
};
