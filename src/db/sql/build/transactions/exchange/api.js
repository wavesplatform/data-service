const { compose, map, merge, pick, filter, has, __, pipe } = require('ramda');

// one — get by id
// many — apply filters
module.exports = ({ query: q, filters: F }) => ({
  one: id => F.id(id, q).toString(),
  many: fValues => {
    const defaultValues = { limit: 100 };
    const order = ['limit', 'timeStart', 'timeEnd', 'matcher', 'sender'];

    const withDefaults = compose(pick(order), merge(defaultValues))(fValues);

    const appliedFs = compose(
      map(x => F[x](withDefaults[x])),
      filter(has(__, withDefaults))
    )(order);

    return pipe(...appliedFs, String)(q);
  },
});
