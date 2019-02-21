export type LogType = string | object;

export const trace = (msg: LogType) => (x: any) => {
  // eslint-disable-next-line
  msg ? console.log(msg, x) : console.log(x);
  return x;
};
