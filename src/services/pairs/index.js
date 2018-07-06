// import refactored resolver
const createData = require('./data');
const createResolvers = require('./resolver');

module.exports = ({ postgres, emitEvent }) => {
  const data = createData({ postgres });

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
