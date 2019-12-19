import { AliasInfo } from '../types/';
import { EndpointRequest, Endpoint } from './types';
import {
  AliasesService,
  AliasesGetRequest,
  AliasesMgetRequest,
  AliasesSearchRequest,
} from '../services/aliases';

export type AliasEndpointRequest = EndpointRequest<AliasesGetRequest>;
export type AliasEndpointResponse = AliasInfo | null;

export type AliasesEndpointRequest = EndpointRequest<
  AliasesMgetRequest | AliasesSearchRequest
>;
export type AliasesEndpointResponse = (AliasInfo | null)[];

export type AliasEndpoint = Endpoint<
  AliasEndpointRequest,
  AliasEndpointResponse
>;
export type AliasesEndpoint = Endpoint<
  AliasesEndpointRequest,
  AliasesEndpointResponse
>;

export default (
  service: AliasesService
): {
  one: AliasEndpoint;
  many: AliasesEndpoint;
} => {
  return {
    one: req =>
      service.get(req.payload).map(m =>
        m.matchWith({
          Just: ({ value }) => value,
          Nothing: () => null,
        })
      ),
    many: req => {
      const payload = req.payload;

      const isMget = (
        payload: AliasesEndpointRequest['payload']
      ): payload is AliasesMgetRequest => Array.isArray(payload);

      return isMget(payload) ? service.mget(payload) : service.search(payload);
    },
  };
};
