import { EmitEvent } from 'services/_common/createResolver/types';
import { searchPreset } from '../presets/common/search';
import { getBalances } from './data';

const { inputSearch, output } = require('./schema');

module.exports = ({
  drivers,
  emitEvent,
}: {
  drivers: any;
  emitEvent: EmitEvent;
}) => {
  return {
    search: searchPreset({
      name: 'balances.search',
      getData: getBalances,
      inputSchema: inputSearch,
      resultSchema: output,
    })({ db: drivers.balances, emitEvent: emitEvent }),
  };
};
