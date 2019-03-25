import { list } from '../list';

const items = [{ id: 'qwe', f: 0 }, { id: 'asd', f: 1 }];

describe('List type should be', () => {
  it('constructed from array', () => {
    expect(list(items)).toEqual({
      __type: 'list',
      data: items,
    });
  });
  it('adds meta', () => {
    expect(list(items, { someValue: true })).toEqual({
      __type: 'list',
      data: items,
      someValue: true,
    });
  });
});
