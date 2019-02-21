import { fromMaybe } from '../';
import { of as maybeOf, empty as maybeEmpty } from 'folktale/maybe';
import createNamedType from '../createNamedType';

type RawData = {
  id: string;
  timestamp: Date;
};

const mock = createNamedType<RawData>('type');
const data: RawData = { id: 'qwe', timestamp: new Date() };

describe('fromMaybe should construct type from', () => {
  it('Just', () => expect(fromMaybe(mock)(maybeOf(data))).toEqual(mock(data)));

  it('Nothing', () => expect(fromMaybe(mock)(maybeEmpty())).toEqual(mock()));
});
