const { fromPromised } = require('folktale/concurrency/task');

const { evolve } = require('ramda');

module.exports = evolve({
  many: fromPromised,
  none: fromPromised,
});
