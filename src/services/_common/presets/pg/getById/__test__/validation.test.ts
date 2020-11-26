import { of as taskOf } from 'folktale/concurrency/task';
import { always, identity, T } from 'ramda';
import { SchemaLike } from 'joi';

import { Joi } from '../../../../../../utils/validation';
import { PgDriver } from '../../../../../../db/driver';

import { getByIdPreset } from '../../getById';

const createService = (resultSchema: SchemaLike) =>
  getByIdPreset<string, string, string>({
    name: 'some_name',
    sql: identity,
    resultSchema,
    transformResult: identity,
  })({
    pg: { oneOrNone: (id: string) => taskOf(id) } as PgDriver,
    emitEvent: always(T),
  });

describe('getById', () => {
  describe('input validation', () => {
    // passing result validation
    const service = createService(Joi.any());

    it('passes if id param is a string', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onResolved: x => {
            expect(x).toBeJust('someidgoeshere2942415');
            done();
          },
          onRejected: () => done.fail,
        }));
  });

  describe('result validation', () => {
    // failing result validation
    const service = createService(Joi.any().valid('qweasd'));

    it('applies schema correctly', done =>
      service('someidgoeshere2942415')
        .run()
        .listen({
          onRejected: e => {
            expect(e.type).toBe('Resolver');
            done();
          },
        }));
  });
});
