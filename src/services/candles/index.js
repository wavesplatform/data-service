const { of } = require('folktale/concurrency/task');

module.exports = () => {
  return {
    search: () => of(() => {}),
  };
};
