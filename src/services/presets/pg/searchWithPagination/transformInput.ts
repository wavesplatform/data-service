import { has } from 'ramda';

import {
  decode,
  SortAscend,
  SortDescend,
} from '../../../_common/pagination/cursor';

const decodeAfter = (cursorString: string) =>
  decode(cursorString).matchWith({
    Ok: ({ value }) => ({
      after: value,
      ...{ sort: value.sort },
    }),
    Error: () => ({}),
  });

export const transformInput = <
  RequestRaw extends RequestTransformed & { after?: SortAscend | SortDescend },
  RequestTransformed
>(
  filters: RequestRaw
): RequestTransformed => {
  if (has('after', filters)) {
    return { ...filters, ...decodeAfter(filters.after) };
  }

  return filters;
};
