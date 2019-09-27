const { findIndex, slice, concat, type, curryN } = require('ramda');

const hasMethod = curryN(
  2,
  (method, x) => (x && x[method] && type(x[method]) === 'Function') || false
);

const createPointfree = method => (...args) => {
  const instanceIdx = findIndex(hasMethod(method), args);

  if (instanceIdx !== -1) {
    return args[instanceIdx].clone()[method](...slice(0, instanceIdx, args));
  } else {
    return (...args2) => createPointfree(method)(...concat(args, args2));
  }
};

module.exports = {
  hasMethod,
  where: createPointfree('where'),
  whereIn: createPointfree('whereIn'),
  whereRaw: createPointfree('whereRaw'),
  limit: createPointfree('limit'),
  orWhere: createPointfree('orWhere'),
  orderBy: createPointfree('orderBy'),
  raw: createPointfree('raw'),
};
