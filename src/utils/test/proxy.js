const createProxy = (fn = () => {}) =>
  new Proxy(fn, {
    get: (_, prop) => {
      fn({ get: prop });
      return createProxy(fn);
    },
    apply: function(target, thisArg, argumentsList) {
      fn({ apply: argumentsList });
      return createProxy(fn);
    },
  });

module.exports = createProxy;
