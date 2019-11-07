import { withStatementTimeout } from '../../driver';
import { isStatementTimeoutErrorMessage } from '../../driver/utils';
import createDb from './createDb';

describe('Db', () => {
  const db = createDb();
  it('should throw and recognize timeout error', done => {
    withStatementTimeout(db, 1, 30000)
      .none('select pg_sleep(1);')
      .run()
      .listen({
        onResolved: () => done.fail('Error was not throwed'),
        onRejected: e =>
          isStatementTimeoutErrorMessage(e.error.message)
            ? done()
            : done.fail(
                `Error message ${e.error.message} does not satisfy determined`
              ),
      });
  });
});
