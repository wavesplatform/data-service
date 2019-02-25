export type LogType = string | object;

export const trace = (msg: LogType) => <T>(x: T): T => {
  // eslint-disable-next-line
  msg ? console.log(msg, x) : console.log(x);
  return x;
};
