import { PgDriver } from 'db/driver';
import { EmitEvent } from 'services/_common/createResolver/types';

export type ServicePresetInitOptions = {
  pg: PgDriver;
  emitEvent: EmitEvent;
};
