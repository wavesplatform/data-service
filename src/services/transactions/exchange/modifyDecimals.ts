import { Task } from 'folktale/concurrency/task';
import { defaultTo, splitEvery, zipWith } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { ExchangeTx, OrderType } from './repo/types';

const wavesByDefault = defaultTo('WAVES');

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: ExchangeTx[]
): Task<AppError, ExchangeTx[]> =>
  assetsService
    .precisions({
      ids: txs
        .map((tx) => [
          wavesByDefault(tx.feeAsset),
          wavesByDefault(tx.order1.assetPair.amountAsset),
          wavesByDefault(tx.order1.assetPair.priceAsset),
          tx.order1.orderType === OrderType.Buy
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          tx.order1.orderType === OrderType.Sell
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          wavesByDefault(tx.order1.matcherFeeAssetId),
          wavesByDefault(tx.order2.matcherFeeAssetId),
        ])
        .reduce((acc, cur) => acc.concat(cur), []),
    })
    .map((v: number[]) =>
      zipWith(
        (
          tx,
          [
            feePrecision,
            amountPrecision,
            pricePrecision,
            buyMatcherFeePrecision,
            sellMatcherFeePrecision,
            order1MatcherFeePrecision,
            order2MatcherFeePrecision,
          ]
        ) => ({
          ...tx,
          fee: tx.fee.shiftedBy(-feePrecision),
          amount: tx.amount.shiftedBy(-amountPrecision),
          price: tx.price.shiftedBy(-8 - pricePrecision + amountPrecision),
          buyMatcherFee: tx.buyMatcherFee.shiftedBy(-buyMatcherFeePrecision),
          sellMatcherFee: tx.sellMatcherFee.shiftedBy(-sellMatcherFeePrecision),
          order1: {
            ...tx.order1,
            amount: tx.order1.amount.shiftedBy(-amountPrecision),
            price: tx.order1.price.shiftedBy(-8 - pricePrecision + amountPrecision),
            matcherFee: tx.order1.matcherFee.shiftedBy(-order1MatcherFeePrecision),
          },
          order2: {
            ...tx.order2,
            amount: tx.order2.amount.shiftedBy(-amountPrecision),
            price: tx.order2.price.shiftedBy(-8 - pricePrecision + amountPrecision),
            matcherFee: tx.order2.matcherFee.shiftedBy(-order2MatcherFeePrecision),
          }
        })
        ,
        txs,
        splitEvery(v.length / txs.length, v)
      )
    );
