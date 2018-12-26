const { propIs, prop } = require('ramda');

let timeRepository = {};

module.exports = {
  timeStart: name => ((timeRepository[name] = new Date()), null),
  timeEnd: name =>
    propIs(Date, name, timeRepository)
      ? `${new Date() - prop(name, timeRepository)} ms`
      : `-/-`,
};
