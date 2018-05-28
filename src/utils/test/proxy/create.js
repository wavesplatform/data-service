const createProxy = (fnOrObj = () => {}) => {
  const defaults = {
    fn: () => {},
    name: '@proxy',
    reservedFields: {},
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

  let toPrimitive;

  const p = new Proxy(params.fn, {
    get: (_, prop) => {
      if (prop === Symbol.toPrimitive) return toPrimitive;
      if (typeof params.reservedFields[prop] !== 'undefined')
        return params.reservedFields[prop];

      params.fn({ get: prop });
      return p;
    },

    apply: function(target, thisArg, argumentsList) {
      params.fn({ apply: argumentsList });
      return p;
    },
  });

  toPrimitive = () => params.name;

  return p;
};

module.exports = createProxy;
