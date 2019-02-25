import { propIs, prop } from 'ramda';

let timeRepository: Record<string, Date> = {};

export const timeStart = (name: string): void => {
  timeRepository[name] = new Date();
};

export const timeEnd = (name: string): number =>
  propIs(Date, name, timeRepository)
    ? new Date().getTime() - prop(name, timeRepository).getTime()
    : -Infinity;
