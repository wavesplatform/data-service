import { fromMaybe } from '../';
import { of as maybeOf, empty as maybeEmpty } from 'folktale/maybe';
import createNamedType, { NamedType } from '../../types/createNamedType';

type RawData = {
  id: string;
  timestamp: Date;
};
type Data = NamedType<'mock', RawData | null>;

const data: RawData = { id: 'qwe', timestamp: new Date() };
const mock: Data = {
  __type: 'mock',
  data,
};

const mockWithNull: Data = {
  __type: 'mock',
  data: null,
};

const transform = (raw?: RawData): Data => {
  return raw
    ? createNamedType<'mock', RawData | null>('mock', raw)
    : createNamedType<'mock', RawData | null>('mock', null);
};

describe('fromMaybe should construct type from', () => {
  it('Just', () => expect(fromMaybe(transform)(maybeOf(data))).toEqual(mock));
  it('Nothing', () =>
    expect(fromMaybe(transform)(maybeEmpty())).toEqual(mockWithNull));
});
