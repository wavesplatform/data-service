import * as grpc from 'grpc';
import { PgDriver } from 'db/driver';
import { EmitEvent } from 'services/_common/createResolver/types';

export type ServicePresetInitOptions = {
  pg: PgDriver;
  dataEntries: grpc.Client;
  emitEvent: EmitEvent;
};
