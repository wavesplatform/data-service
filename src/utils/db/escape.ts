export const forTsQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[^\w\s]|_/g, '')
    .split(' ')
    .join(' & ');
};

export const forLike = (query: string): string => query.replace(/%/g, '\\%');
