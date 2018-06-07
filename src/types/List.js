const List = (items = [], meta = {}) => ({
  __type: 'list',
  ...meta,
  data: items,
});

module.exports = List;
