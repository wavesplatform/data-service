const Task = require('folktale/concurrency/task');

// eitherToTask :: Either a b -> Task a b
const eitherToTask = e => e.cata(Task.rejected, Task.of);

module.exports = eitherToTask;
