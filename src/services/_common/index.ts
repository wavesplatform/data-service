export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export type WithSortOrder = {
  sort: SortOrder;
};

export type WithLimit = {
  limit: number;
};
