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
          tx.order1.type === OrderType.Buy
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          tx.order1.type === OrderType.Sell
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          wavesByDefault(tx.order1.matcherFeeAssetId),
          wavesByDefault(tx.order2.matcherFeeAssetId),
        ])
        .reduce((acc, cur) => acc.concat(cur), []),
    })
    .map((v) =>
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
          fee: tx.fee.multipliedBy(10 ** -feePrecision),
          amount: tx.amount.multipliedBy(10 ** -amountPrecision),
          price: tx.price.multipliedBy(10 ** -pricePrecision),
          buyMatcherFee: tx.buyMatcherFee.multipliedBy(
            10 ** -buyMatcherFeePrecision
          ),
          sellMatcherFee: tx.sellMatcherFee.multipliedBy(
            10 ** -sellMatcherFeePrecision
          ),
          order1: {
            ...tx.order1,
            amount: tx.order1.amount.multipliedBy(10 ** -amountPrecision),
            price: tx.order1.price.multipliedBy(10 ** -pricePrecision),
            matcherFee: tx.order1.matcherFee.multipliedBy(
              10 ** -order1MatcherFeePrecision
            ),
          },
          order2: {
            ...tx.order2,
            amount: tx.order2.amount.multipliedBy(10 ** -amountPrecision),
            price: tx.order2.price.multipliedBy(10 ** -pricePrecision),
            matcherFee: tx.order2.matcherFee.multipliedBy(
              10 ** -order2MatcherFeePrecision
            ),
          },
        }),
        txs,
        splitEvery(v.length / txs.length, v)
      )
    );
