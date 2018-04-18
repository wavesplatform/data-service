const promiseResolve = (val, delay = 100) =>
  new Promise(res => setTimeout(() => res(val), delay));

const promiseReject = (err, delay = 100) =>
  new Promise((res, rej) => setTimeout(() => rej(err), delay));

module.exports = {
  promiseResolve,
  promiseReject,
};
