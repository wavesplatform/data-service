const createProxy = (fnOrObj = () => {}) => {
  const defaults = {
    fn: () => {},
    name: '@proxy',
    keys: null,
  };
  let params;
  if (typeof fnOrObj === 'function') {
    params = {
      ...defaults,
      fn: fnOrObj,
    };
  } else {
    params = {
      ...defaults,
      ...fnOrObj,
    };
  }

  const p = new Proxy(params.fn, {
    get: (_, prop) => {
      if (prop === Symbol.toPrimitive) return (() => params.name).bind(p);
      if (prop === 'toString') return (() => params.name).bind(p);
      if (prop === 'valueOf') return (() => params.name).bind(p);

      params.fn({ get: prop });
      return p;
    },

    apply: function(target, thisArg, argumentsList) {
      params.fn({ apply: argumentsList });
      return p;
    },
    has(_, key) {
      return params.keys ? params.keys.includes(key) : true;
    },
    ownKeys() {
      return params.keys || [];
    },
  });

  return p;
};

module.exports = createProxy;
