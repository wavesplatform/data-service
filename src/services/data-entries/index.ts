import { compose } from 'ramda';
import { list, DataEntryInfo, DataEntry, dataEntry } from '../../types';
import { DataEntryResponse } from '../../protobuf/data-entries';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getDataEntries } from './data';

import { inputSearch, output } from './schema';
import { transformResult } from './transformResult';
import * as grpc from 'grpc';

type DataServiceDriver = {
  dataEntries: grpc.Client;
};

export default ({
  drivers,
  emitEvent,
}: {
  drivers: DataServiceDriver;
  emitEvent: EmitEvent;
}) => {
  return {
    search: searchPreset({
      name: 'dataEntries.search',
      getData: getDataEntries(drivers.dataEntries),
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: (res: DataEntryResponse[]) =>
        compose(
          l => list<DataEntry>(l),
          (l: DataEntryInfo[]) => l.map(d => dataEntry(d)),
          (l: DataEntryResponse[]) => l.map(d => transformResult(d))
        )(res),
    })({ emitEvent: emitEvent }),
  };
};
