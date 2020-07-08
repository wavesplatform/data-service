const getErrorMessage = require('../../errorHandling/getErrorMessage');

const logTaskProgress = require('../utils/logTaskProgress');
const sql = require('./sql');

/** loop :: Object -> Task a b */
const loop = ({ logTask, pg, pairsTableName }) => {
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
        t.none(sql.truncateTable(pairsTableName)),
        t.none(sql.fillTable(pairsTableName)),
      ])
    )
  );
};

module.exports = ({ logger, pg, pairsTableName }) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    loop: () => loop({ logTask: unsafeLogTaskProgress, pg, pairsTableName }),
  };
};
