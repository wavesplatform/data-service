import { compose } from 'ramda';
import { list, DataEntryInfo, DataEntry, dataEntry } from '../../types';
import { DataEntryResponse } from '../../protobuf/data-entries';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { ServicePresetInitOptions } from '../presets/types';
import { getDataEntries } from './data';

import { inputSearch, output } from './schema';
import { transformResult } from './transformResult';

export default ({
  drivers,
  emitEvent,
}: {
  drivers: ServicePresetInitOptions;
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
