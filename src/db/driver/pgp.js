const { BigNumber } = require('@waves/data-entities');
const { compose, tail, init, split, map } = require('ramda');

const pgp = require('pg-promise')();

const toBigNumber = x => new BigNumber(x);
const parsePgArray = compose(split(','), init, tail);
const toBigNumberAll = compose(map(toBigNumber), parsePgArray);

const types = pgp.pg.types;

types.setTypeParser(20, toBigNumber); // bigint
types.setTypeParser(701, toBigNumber); // double precision/float8
types.setTypeParser(1700, toBigNumber); // numeric

types.setTypeParser(1016, toBigNumberAll); // array/bigint
types.setTypeParser(1022, toBigNumberAll); // array/double precision
types.setTypeParser(1231, toBigNumberAll); // array/numeric

// @hack
// for some reason float4/real does not matter to pg-promise
// as seems to parse it with 'double precision' parser anyway
// If they change it upstream, our integration test will fail and indicate.

// types.setTypeParser(700, toBigNumber); // real/float4
// types.setTypeParser(1021, toBigNumberAll); // array/float

module.exports = pgp;
