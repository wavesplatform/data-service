const getErrorMessage = require('../../errorHandling/getErrorMessage');

const logTaskProgress = require('../utils/logTaskProgress');
const sql = require('./sql');

/** loop :: Object -> Task a b */
const loop = ({ logTask, pg, tableName }) => {
  const logMessages = {
    start: timeStart => ({
      message: '[PAIRS] update started',
      time: timeStart,
    }),
    error: (e, timeTaken) => ({
      message: '[PAIRS] update error',
      time: timeTaken,
      error: getErrorMessage(e),
    }),
    success: (_, timeTaken) => ({
      message: '[PAIRS] update success',
      time: timeTaken,
    }),
  };

  return logTask(
    logMessages,
    pg.tx(t =>
      t.batch([
        t.none(sql.truncateTable(tableName)),
        t.none(sql.fillTable(tableName)),
      ])
    )
  );
};

module.exports = ({ logger, pg, tableName }) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    loop: () => loop({ logTask: unsafeLogTaskProgress, pg, tableName }),
  };
};
