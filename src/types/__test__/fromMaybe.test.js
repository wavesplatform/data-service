const { fromMaybe } = require('../');

const Maybe = require('folktale/maybe');

const rawData = { id: 'qwe', timestamp: new Date() };

const TypeMock = (data = null) => ({
  __type: 'type',
  data,
});

describe('fromMaybe should construct type from', () => {
  it('Just', () =>
    expect(fromMaybe(TypeMock, Maybe.of(rawData))).toEqual(TypeMock(rawData)));

  it('Nothing', () =>
    expect(fromMaybe(TypeMock, Maybe.empty())).toEqual(TypeMock()));
});
