import { decode } from '../../../_common/pagination/cursor';
import {
  RequestRaw as RequestRawWithCursor,
  RequestTransformed as RequestTransformedWithCursor,
} from './index';

const decodeAfter = (cursorString: string) =>
  decode(cursorString).matchWith({
    Ok: ({ value }) => ({
      after: value,
      ...{ sort: value.sort },
    }),
    Error: () => ({}),
  });

export const transformInput = <Request>(
  request: RequestRawWithCursor<Request>
): RequestTransformedWithCursor<Request> =>
  request.after
    ? { ...request, ...decodeAfter(request.after) }
    : { ...request, after: undefined };
