import { Task } from 'folktale/concurrency/task';
import { defaultTo, splitEvery, zipWith } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { ExchangeTx, OrderType } from './repo/types';

const wavesByDefault = defaultTo('WAVES');

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: ExchangeTx[]
): Task<AppError, ExchangeTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) => [
        {
          value: tx.fee,
          assetId: wavesByDefault(tx.feeAsset),
        },
        {
          value: tx.amount,
          assetId: wavesByDefault(tx.amountAsset),
        },
        {
          value: tx.price,
          assetId: wavesByDefault(tx.priceAsset),
        },
        {
          value: tx.buyMatcherFee,
          assetId:
            tx.order1.type === OrderType.Buy
              ? wavesByDefault(tx.order1.matcherFeeAssetId)
              : wavesByDefault(tx.order2.matcherFeeAssetId),
        },
        {
          value: tx.sellMatcherFee,
          assetId:
            tx.order1.type === OrderType.Sell
              ? wavesByDefault(tx.order1.matcherFeeAssetId)
              : wavesByDefault(tx.order2.matcherFeeAssetId),
        },
        {
          value: tx.order1.amount,
          assetId: wavesByDefault(tx.amountAsset),
        },
        {
          value: tx.order1.price,
          assetId: wavesByDefault(tx.priceAsset),
        },
        {
          value: tx.order1.matcherFee,
          assetId: wavesByDefault(tx.order1.matcherFeeAssetId),
        },
        {
          value: tx.order2.amount,
          assetId: wavesByDefault(tx.amountAsset),
        },
        {
          value: tx.order2.price,
          assetId: wavesByDefault(tx.priceAsset),
        },
        {
          value: tx.order2.matcherFee,
          assetId: wavesByDefault(tx.order2.matcherFeeAssetId),
        },
      ])
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    zipWith(
      (
        tx,
        [
          fee,
          amount,
          price,
          buyMatcherFee,
          sellMatcherFee,
          order1Amount,
          order1Price,
          order1MatcherFee,
          order2Amount,
          order2Price,
          order2MatcherFee,
        ]
      ) => ({
        ...tx,
        fee: fee,
        amount: amount,
        price: price,
        buyMatcherFee: buyMatcherFee,
        sellMatcherFee: sellMatcherFee,
        order1: {
          ...tx.order1,
          amount: order1Amount,
          price: order1Price,
          matcherFee: order1MatcherFee,
        },
        order2: {
          ...tx.order2,
          amount: order2Amount,
          price: order2Price,
          matcherFee: order2MatcherFee,
        },
      }),
      txs,
      splitEvery(11, v)
    )
  );
