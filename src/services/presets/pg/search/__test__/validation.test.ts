import { always, T } from 'ramda';
import { of as task } from 'folktale/concurrency/task';

import { Joi } from '../../../../../utils/validation';
import { list, List } from '../../../../../types';
import { searchPreset } from '..';
import {
  Serializable,
  toSerializable,
} from '../../../../../types/serialization';
import { PgDriver } from '../../../../../db/driver';

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
  TestTransaction,
  List<Serializable<'tx', TestTransaction | null>>
>({
  name: 'some_name',
  sql: () => '',
  inputSchema: Joi.any(),
  resultSchema: Joi.any(),
  transformResult: (res: TestTransaction[]) =>
    list(res.map(tx => toSerializable<'tx', TestTransaction>('tx', tx))),
})({
  pg: { any: filters => task(mockTxs) } as PgDriver,
  emitEvent: always(T),
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
