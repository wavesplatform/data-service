import { BigNumber } from '@waves/data-entities';
import { compose, tail, init, split } from 'ramda';
import { IMain } from 'pg-promise';
import * as pgPromise from 'pg-promise';

import { toBigNumber } from '../../utils/bigNumber';

// 1) add import
import { attach } from 'pg-monitor';
// 2) create empty object
const i = {}
// 3) pass it
const pgp: IMain = pgPromise(i);
// 4) attach to it
attach(i);

// const pgp: IMain = pgPromise();

const parsePgArray = compose<string, string, string, string[]>(
  split(','),
  init,
  tail
);

const toBigNumberAll = (s: string): BigNumber[] =>
  parsePgArray(s).map(toBigNumber);

const types = pgp.pg.types;

types.setTypeParser(20, toBigNumber); // bigint
types.setTypeParser(701, toBigNumber); // double precision/float8
types.setTypeParser(1700, toBigNumber); // numeric

types.setTypeParser(1016, toBigNumberAll); // array/bigint
types.setTypeParser(1022, toBigNumberAll); // array/double precision
types.setTypeParser(1231, toBigNumberAll); // array/numeric

// @hack
// for some reason float4/real does not matter to pg-promise
// as it seems to parse it with 'double precision' parser anyway
// If they change it upstream, our integration test will fail and indicate.

// types.setTypeParser(700, toBigNumber); // real/float4
// types.setTypeParser(1021, toBigNumberAll); // array/float

export const pgpConnect = pgp;
