const promiseResolve = (val, delay = 100) =>
  new Promise(res => setTimeout(() => res(val), delay));

const promiseReject = (err, delay = 100) =>
  new Promise((res, rej) => setTimeout(() => rej(err), delay));

const universalProxy = new Proxy(
  { toString: () => 'str', valueOf: () => 1 },
  { get: (obj, prop) => (prop in obj ? obj[prop] : universalProxy) }
);
module.exports = {
  promiseResolve,
  promiseReject,
  universalProxy,
};
