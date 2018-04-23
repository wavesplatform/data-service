const { map, assoc } = require('ramda');

const addListInfo = (items, cursorHashFn) => {
  if (cursorHashFn) return map(d => assoc('cursor', cursorHashFn(d), d), items);
  else return items;
};

const List = (items, cursorHashFn) => ({
  __type: 'list',
  data: addListInfo(items, cursorHashFn),
});

module.exports = List;
