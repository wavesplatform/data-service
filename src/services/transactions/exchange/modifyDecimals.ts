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
          wavesByDefault(tx.amountAsset),
          wavesByDefault(tx.priceAsset),
          tx.order1.type === OrderType.Buy
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          tx.order1.type === OrderType.Sell
            ? wavesByDefault(tx.order1.matcherFeeAssetId)
            : wavesByDefault(tx.order2.matcherFeeAssetId),
          wavesByDefault(tx.amountAsset),
          wavesByDefault(tx.priceAsset),
          wavesByDefault(tx.order1.matcherFeeAssetId),
          wavesByDefault(tx.amountAsset),
          wavesByDefault(tx.priceAsset),
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
            order1AmountPrecision,
            order1PricePrecision,
            order1MatcherFeePrecision,
            order2AmountPrecision,
            order2PricePrecision,
            order2MatcherFeePrecision,
          ]
        ) => ({
          ...tx,
          fee: tx.fee.dividedBy(10 ** feePrecision),
          amount: tx.amount.dividedBy(10 ** amountPrecision),
          price: tx.price.dividedBy(10 ** pricePrecision),
          buyMatcherFee: tx.buyMatcherFee.dividedBy(
            10 ** buyMatcherFeePrecision
          ),
          sellMatcherFee: tx.sellMatcherFee.dividedBy(
            10 ** sellMatcherFeePrecision
          ),
          order1: {
            ...tx.order1,
            amount: tx.order1.amount.dividedBy(10 ** order1AmountPrecision),
            price: tx.order1.price.dividedBy(10 ** order1PricePrecision),
            matcherFee: tx.order1.matcherFee.dividedBy(
              10 ** order1MatcherFeePrecision
            ),
          },
          order2: {
            ...tx.order2,
            amount: tx.order2.amount.dividedBy(10 ** order2AmountPrecision),
            price: tx.order2.price.dividedBy(10 ** order2PricePrecision),
            matcherFee: tx.order2.matcherFee.dividedBy(
              10 ** order2MatcherFeePrecision
            ),
          },
        }),
        txs,
        splitEvery(11, v)
      )
    );
