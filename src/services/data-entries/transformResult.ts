import { DataEntryResponse } from '../../protobuf/data-entries';
import { DataEntryInfo } from '../../types/index';
import base58 from '../../utils/base58';

export const transformResult = (d: DataEntryResponse): DataEntryInfo => ({
  ...d,
  address: base58.encode(d.address),
});
