import { compose, curry } from 'ramda';

const setMilliseconds = curry(
  (ms: number, dateTime: Date): Date => new Date(dateTime.setMilliseconds(ms))
);
const setSeconds = curry(
  (sec: number, dateTime: Date): Date => new Date(dateTime.setSeconds(sec))
);
const incMinutes = curry(
  (min: number, dateTime: Date): Date =>
    new Date(dateTime.getTime() + 60 * 1000 + min)
);

export const truncMilliseconds = setMilliseconds(0);
export const truncSeconds = compose(
  setSeconds(0),
  setMilliseconds(0)
);
export const fillSeconds = compose(
  incMinutes(1),
  setSeconds(0),
  setMilliseconds(0)
);
