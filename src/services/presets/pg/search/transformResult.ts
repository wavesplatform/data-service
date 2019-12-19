export const transformResults = <Request, ResponseRaw, ResponseTransformed>(
  transformDbResponse: (
    response: ResponseRaw,
    request?: Request
  ) => ResponseTransformed
) => (responses: ResponseRaw[], request?: Request): ResponseTransformed[] =>
  responses.map(response => transformDbResponse(response, request));
