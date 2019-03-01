import { always, identity } from 'ramda';
import { of as task } from 'folktale/concurrency/task';

import { Joi } from '../../../../../utils/validation';
import { list } from '../../../../../types';
import { searchPreset } from '..';
import createNamedType, {
  NamedType,
} from '../../../../../types/createNamedType';
import { PgDriver } from 'db/driver';

type TestTransaction = {
  id: string;
  timestamp: Date;
};

type TestQueryOptions = {
  limit: number;
  sort: string;
};

const mockTxs: TestTransaction[] = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];

const service = searchPreset<
  TestQueryOptions,
  TestTransaction,
  NamedType<string, TestTransaction>
>({
  name: 'some_name',
  sql: () => '',
  inputSchema: Joi.any(),
  resultSchema: Joi.any(),
  transformResult: (res: TestTransaction[]) =>
    list(res.map(tx => createNamedType<'tx', TestTransaction>('tx', tx))),
})({
  pg: { any: filters => task(mockTxs) } as PgDriver,
  emitEvent: always(identity),
});

describe('search preset validation', () => {
  describe('common filters', () => {
    it('passes if correct object is provided', done =>
      service({
        limit: 1,
        sort: 'asc',
      })
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            x.data.map(tx => expect(tx.__type).toBe('tx'));
            done();
          },
        }));
  });
});
