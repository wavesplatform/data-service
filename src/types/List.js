const List = (items = [], cursorHashFn) => ({
  __type: 'list',
  ...(cursorHashFn && items.length > 0
    ? {
      lastCursor: cursorHashFn(items),
    }
    : {}),
  data: items,
});

module.exports = List;
