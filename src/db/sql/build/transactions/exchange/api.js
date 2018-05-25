const { compose, map, merge, pick, pipe } = require('ramda');

// one — get by id
// many — apply filters
module.exports = ({ query: q, filters: F }) => ({
  one: id => F.id(id, q).toString(),
  many: fParams => {
    const psDefaults = { limit: 100 };
    const order = ['limit', 'timeStart', 'timeEnd', 'matcher', 'sender'];

    const withDefaults = compose(pick(order), merge(psDefaults))(fParams);
    const appliedFs = map(x => F[x](withDefaults[x]), order);

    return pipe(...appliedFs, String)(q);
  },
});
