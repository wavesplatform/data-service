import { always, identity, equals, T } from 'ramda';
import { SchemaLike } from 'joi';
import { of as taskOf } from 'folktale/concurrency/task';

import { Joi } from '../../../../../utils/validation';
import { mgetByIdsPreset } from '..';
import {
  toSerializable,
  Serializable,
} from '../../../../../types/serialization';
import { PgDriver } from '../../../../../db/driver';
const { inputMget: input } = require('../inputSchema');

const createService = (resultSchema: SchemaLike) =>
  mgetByIdsPreset<string, string, string, Serializable<'test', string | null>>({
    name: 'some_name',
    sql: (s: string[]) => s.join(';'),
    matchRequestResult: equals,
    inputSchema: input,
    resultSchema,
    transformResult: identity,
    resultTypeFactory: (a?: string | null) =>
      toSerializable<'test', string | null>('test', a ? a : null),
  })({
    pg: {
      any: ids => taskOf(ids.split(';')),
    } as PgDriver,
    emitEvent: always(T),
  });

describe('mgetByIds', () => {
  describe('input validation', () => {
    // passing result validation
    const service = createService(Joi.any());

    it('fails if ids params is not a base58 string array', done =>
      service(['10'])
        .run()
        .promise()
        .then(() => done('Wrong branch, error'))
        .catch(e => {
          expect(e.type).toBe('Validation');
          done();
        }));
    it('passes if ids param is an empty array', done =>
      service([])
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
    it('passes if ids param is a base58 string array', done =>
      service(['someidgoeshere2942415', 'qwe', 'asd'])
        .run()
        .listen({
          onResolved: x => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
  });

  describe('result validation', () => {
    // failing result validation
    const service = createService(Joi.any().valid('qweasd'));

    it('applies schema correctly', done =>
      service(['someidgoeshere2942415'])
        .run()
        .listen({
          onRejected: e => {
            expect(e.type).toBe('Resolver');
            done();
          },
          onResolved: console.log,
        }));
  });
});
