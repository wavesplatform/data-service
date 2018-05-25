const { findIndex, slice, concat, type, curryN } = require('ramda');

const hasMethod = curryN(
  2,
  (method, x) => type(x) === 'Object' && type(x[method]) === 'Function'
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
  limit: createPointfree('limit'),
  orWhere: createPointfree('orWhere'),
};
