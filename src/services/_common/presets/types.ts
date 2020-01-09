import { PgDriver } from 'db/driver';
import { EmitEvent } from '../createResolver/types';

export type RepoPresetInitOptions = {
  pg: PgDriver;
  emitEvent: EmitEvent;
};
