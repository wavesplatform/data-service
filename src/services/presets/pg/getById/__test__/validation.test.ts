import { of as taskOf } from 'folktale/concurrency/task';
import { always, identity } from 'ramda';

import { Joi } from '../../../../../utils/validation';

import { getByIdPreset } from '..';
import { inputGet as input } from '../inputSchema';
import { SchemaLike } from 'joi';
import { PgDriver } from '../../../../../db/driver';
import { Serializable } from '../../../../../types';

const createService = (resultSchema: SchemaLike) =>
  getByIdPreset<string, string, Serializable<'test', string | undefined>>({
    name: 'some_name',
    sql: identity,
    inputSchema: input,
    resultSchema,
    transformResult: identity,
    resultTypeFactory: (
      s?: string
    ): Serializable<'test', string | undefined> => ({
      data: s,
      __type: 'test',
    }),
  })({
    pg: { oneOrNone: (id: string) => taskOf(id) } as PgDriver,
    emitEvent: always(identity),
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
            expect(x.__type).toBe('test');
            done();
          },
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
