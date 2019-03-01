import { PgDriver } from 'db/driver';
import { EmitEvent } from 'services/_common/createResolver/types';
import { NamedType } from 'types/createNamedType';

export type ServicePresetInitOptions = {
  pg: PgDriver;
  emitEvent: EmitEvent;
};

export type DataType<T extends NamedType<string, any>> = T extends NamedType<
  string,
  infer R
>
  ? R
  : never;
