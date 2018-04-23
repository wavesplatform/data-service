const List = require('./List');

const items = [{ id: 'qwe', f: 0 }, { id: 'asd', f: 1 }];

describe('List type should be', () => {
  it('constructed from array', () => {
    expect(List(items)).toEqual({
      __type: 'list',
      items,
    });
  });

  it('apply a hash function', () => {
    const hash = item => item.id + '_' + item.f;

    expect(List(items, hash)).toEqual({
      __type: 'list',
      items: [
        {
          cursor: 'qwe_0',
          ...items[0],
        },
        {
          cursor: 'asd_1',
          ...items[1],
        },
      ],
    });
  });
});
