const Task = require('folktale/concurrency/task');

/** unsafeLogTask :: Logger -> (Messages, Task a b) -> Task a b */
const logTaskProgress = logger => (messages, t) =>
  Task.of(new Date())
    .map(timeStart => (logger.info(messages.start(timeStart)), timeStart))
    .chain(timeStart =>
      t.bimap(
        l => {
          logger.error(messages.error(l, new Date() - timeStart));
          return l;
        },
        r => {
          logger.info(messages.success(r, new Date() - timeStart));
        }
      )
    );

module.exports = logTaskProgress;
