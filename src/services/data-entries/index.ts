import { compose } from 'ramda';
import { list, DataEntry, dataEntry } from '../../types';
import { DataEntry as PBDataEntry } from '../../protobuf/data-entries_pb';
import { EmitEvent } from '../_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getDataEntries } from './data';

import { inputSearch, output } from './schema';

export default ({
  drivers,
  emitEvent,
}: {
  drivers: any;
  emitEvent: EmitEvent;
}) => {
  return {
    search: searchPreset({
      name: 'dataEntries.search',
      getData: getDataEntries,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: res =>
        compose(
          l => list<DataEntry>(l),
          (l: PBDataEntry.AsObject[]) => l.map(d => dataEntry(d))
        )(res),
    })({ db: drivers.dataEntries, emitEvent: emitEvent }),
  };
};
