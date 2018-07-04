const Task = require('folktale/concurrency/task');

/** Result e v -> Task e v */
const resultToTask = r =>
  r.matchWith({
    Ok: ({ value }) => Task.of(value),
    Error: ({ value }) => Task.rejected(value),
  });

module.exports = resultToTask;
