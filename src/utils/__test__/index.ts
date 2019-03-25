export const promiseResolve = <T>(val: T, delay: number = 100): Promise<T> =>
  new Promise<T>(res => setTimeout(() => res(val), delay));

export const promiseReject = <T>(err: Error, delay: number = 100): Promise<T> =>
  new Promise<T>((res, rej) => setTimeout(() => rej(err), delay));
