const { propIs, prop } = require('ramda');

let timeRepository = {};

const timeStart = name => (timeRepository[name] = new Date(), null);
const timeEnd = name =>
  propIs(Date, name, timeRepository)
    ? `${new Date() - prop(name, timeRepository)} ms`
    : `-/-`;

module.exports = {
  timeStart,
  timeEnd,
};
