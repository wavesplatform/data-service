import { of as task } from 'folktale/concurrency/task';
import { always, identity } from 'ramda';

import { parseDate } from '../../../../../utils/parseDate';
import { Joi } from '../../../../../utils/validation';
import { searchWithPaginationPreset, WithSortOrder, WithLimit } from '..';
import commonFilterSchemas from '../commonFilterSchemas';
import {
  Serializable,
  toSerializable,
} from '../../../../../types/serialization';
import { PgDriver } from '../../../../../db/driver';
import { SortOrder } from '../../../../_common/pagination/cursor';

const mockTxs: ResponseRaw[] = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];

type Request = WithSortOrder & WithLimit & {
  timeEnd?: Date;
  timeStart?: Date;
}

type ResponseRaw = {
  id: string;
  timestamp: Date;
};

const service = searchWithPaginationPreset<
  Request,
  ResponseRaw,
  Serializable<string, ResponseRaw>
>({
  name: 'some_name',
  sql: () => '',
  inputSchema: Joi.object().keys(commonFilterSchemas),
  resultSchema: Joi.any(),
  transformResult: (response: ResponseRaw) =>
    toSerializable<'tx', ResponseRaw>('tx', response),
})({
  pg: { any: filters => task(mockTxs) } as PgDriver,
  emitEvent: always(identity),
});

const assertValidationError = (done: jest.DoneCallback, v: Request) =>
  service(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch(e => {
      expect(e.type).toBe('Validation');
      done();
    });

describe('searchWithPagination preset validation', () => {
  describe('common filters', () => {
    it('fails if timeEnd < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('-1525132900000').unsafeGet(),
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132900000').unsafeGet(),
        timeStart: parseDate('-1525132800000').unsafeGet(),
        sort: SortOrder.Ascending,
      }));
    it('fails if timeEnd < timeStart', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132700000').unsafeGet(),
        timeStart: parseDate('1525132800000').unsafeGet(),
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart->invalid Date', done => {
      expect(parseDate('').unsafeGet).toThrowError();
      done();
    });
    it('passes if correct object is provided', done =>
      service({
        timeStart: new Date(0),
        timeEnd: new Date(),
        limit: 1,
        sort: SortOrder.Ascending,
      })
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
  });
});
