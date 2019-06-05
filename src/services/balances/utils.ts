import * as Long from 'long';
import {
  BalancesByTransactionRequest,
  BalancesByAddressRequest,
  BalancesByAssetRequest,
} from '../../protobuf/balances';
import { BalancesService } from '../../protobuf/balances_grpc_pb';
import base58 from '../../utils/base58';
import { BalancesRequest, GrpcBalancesRequest } from './types';

export const reqSerializer = (request: GrpcBalancesRequest): Buffer => {
  if (request instanceof BalancesByTransactionRequest) {
    return Buffer.from(BalancesByTransactionRequest.encode(request).finish());
  } else if (request instanceof BalancesByAddressRequest) {
    return Buffer.from(BalancesByAddressRequest.encode(request).finish());
  } else {
    return Buffer.from(BalancesByAssetRequest.encode(request).finish());
  }
};

export const getPathByReq = (req: BalancesRequest) => {
  if (req.transaction_id) {
    return BalancesService.byTransaction.path;
  } else if (req.address) {
    return BalancesService.byAddress.path;
  } else {
    return BalancesService.byAsset.path;
  }
};

export const buildRequest = (req: BalancesRequest): GrpcBalancesRequest => {
  let request;
  if (req.transaction_id) {
    request = new BalancesByTransactionRequest({
      transactionId: base58.decode(req.transaction_id),
    });
  } else {
    if (req.address) {
      request = new BalancesByAddressRequest({
        address: base58.decode(req.address),
      });
    } else {
      request = new BalancesByAssetRequest();
    }

    if (req.asset) {
      request.asset = base58.decode(req.asset);
    }
    if (req.height) {
      request.height = req.height;
    }
    if (req.timestamp) {
      request.timestamp = Long.fromNumber(req.timestamp.getTime());
    }
    if (req.after) {
      request.after = base58.decode(req.after);
    }
    request.limit = req.limit;
  }
  return request;
};
