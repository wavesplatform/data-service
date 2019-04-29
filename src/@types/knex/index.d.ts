import { QueryBuilder, Raw, QueryCallback } from 'knex';

declare module 'knex' {
  type Column = string | Raw | QueryBuilder;
  export type Identifier = Record<string, Column>;
  export type ColumnName = Column | Identifier;
  export type TableName =
    | string
    | Raw
    | QueryBuilder
    | { [key: string]: string };

  interface Select {
    (aliases: ColumnName[]): QueryBuilder;
    (...aliases: ColumnName[]): QueryBuilder;
  }

  interface Join {
    (qb: QueryCallback): QueryBuilder;
  }
}
