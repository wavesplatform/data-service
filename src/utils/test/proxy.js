const createProxy = (fn = () => {}, keys) =>
  new Proxy(fn, {
    get: (_, prop) => {
      fn({ get: prop });
      return createProxy(fn);
    },
    apply: function(target, thisArg, argumentsList) {
      fn({ apply: argumentsList });
      return createProxy(fn);
    },
    has(_, key) {
      return keys ? keys.includes(key) : true;
    },
    ownKeys() {
      return keys || [];
    },
  });

module.exports = createProxy;
