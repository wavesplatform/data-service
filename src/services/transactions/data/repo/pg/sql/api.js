const { assoc, compose, merge, pick, pipe } = require('ramda');

const { pickBindFilters } = require('../../../../../../utils/db');
const defaultValues = require('../../../../_common/sql/defaults');
const { select, selectFromFiltered } = require('./query');

// one — get by id
// many — apply filters
module.exports = ({ filters: F }) => ({
  get: id =>
    pipe(
      F.id(id),
      // tips for postgresql to use index
      F.limit(1),
      selectFromFiltered,
      String
    )(select),

  mget: ids =>
    pipe(
      F.ids(ids),
      // tips for postgresql to use index
      F.sort(defaultValues.SORT),
      F.limit(ids.length),
      selectFromFiltered,
      String
    )(select),

  search: (fValues = {}) => {
    const fNames = [
      'after',
      // tx attributes
      'timeStart',
      'timeEnd',
      'sender',
      // data attributes
      'key',
      'type',
      'value',
      // common
      'sort',
      'limit',
    ];

    // { [fName]: fValue }
    const withDefaults = compose(pick(fNames), merge(defaultValues))(fValues);

    const withValueF =
      withDefaults.value !== undefined
        ? assoc('value', F.value(withDefaults.type), F)
        : F;

    const fs = pickBindFilters(
      withValueF,
      // filter by type+value or type
      withDefaults.value !== undefined
        ? fNames.filter(name => name !== 'type')
        : fNames,
      withDefaults
    );

    const fQuery = fs.length ? pipe(...fs)(select) : select;

    return pipe(selectFromFiltered, F.sort(withDefaults.sort), String)(fQuery);
  },
});
