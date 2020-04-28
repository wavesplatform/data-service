import { loadConfig } from '../../../loadConfig';
import { isStatementTimeoutErrorMessage } from '../../driver/utils';
import createDb from './createDb';

const cfg = loadConfig();

describe('Db', () => {
  // run test in case postgresStatementTimoout is set only
  if (typeof cfg.postgresStatementTimeout === 'number') {
    const timeout = cfg.postgresStatementTimeout;
    const db = createDb();
    it(
      'should throw and recognize timeout error',
      (done) => {
        db.none('select pg_sleep($1);', timeout / 1000 + 1) // timeout (in ms) + 1s
          .run()
          .listen({
            onResolved: () => done.fail('Error was not thrown'),
            onRejected: (e) =>
              isStatementTimeoutErrorMessage(e.error.message)
                ? done()
                : done.fail(
                    `Error message ${e.error.message} does not satisfy determined`
                  ),
          });
      },
      timeout + 1000
    );
  }
});
