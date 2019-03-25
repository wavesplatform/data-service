import { QueryBuilder, Raw } from 'knex';

declare module 'knex' {
  type Column = string | Raw | QueryBuilder;
  export type Identifier = Record<string, Column>;
  export type ColumnName = Column | Identifier;

  interface Select {
    (aliases: ColumnName[]): QueryBuilder;
    (...aliases: ColumnName[]): QueryBuilder;
  }
}
