// import refactored resolver
const createData = require('./data');
const createResolvers = require('./resolver');

module.exports = ({ drivers, emitEvent }) => {
  const data = createData({ drivers, emitEvent });

  return {
    get: createResolvers.one({
      getData: data.get,
      emitEvent,
    }),
    mget: createResolvers.many({
      getData: data.mget,
      emitEvent,
    }),
  };
};
