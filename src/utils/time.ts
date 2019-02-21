import { propIs, prop } from 'ramda';

export type DateMap = { [key: string]: Date };
let timeRepository = {} as DateMap;

export const timeStart = (name: string) => (
  (timeRepository[name] = new Date()), null
);

export const timeEnd = (name: string): string =>
  propIs(Date, name, timeRepository)
    ? `${new Date().getTime() - prop(name, timeRepository).getTime()} ms`
    : `-/-`;
