import { Task } from 'folktale/concurrency/task';
import { defaultTo, zipObj } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { ExchangeTx, OrderPriceMode, OrderType } from './repo/types';

const wavesByDefault = defaultTo('WAVES');

export const modifyDecimals =
  (assetsService: AssetsService) =>
  (txs: ExchangeTx[]): Task<AppError, ExchangeTx[]> => {
    // extract unique assetIds participating in provided transactions
    const participatingAssetIds = Array.from(
      txs.reduce(
        (assetIds, tx) =>
          [
            tx.feeAsset,
            tx.order1.assetPair.amountAsset,
            tx.order1.assetPair.priceAsset,
            tx.order1.matcherFeeAssetId,
            tx.order2.matcherFeeAssetId,
          ]
            .map(wavesByDefault)
            .reduce((set, id) => set.add(id), assetIds),
        new Set<string>()
      )
    );

    return assetsService
      .precisions({ ids: participatingAssetIds })
      .map(zipObj(participatingAssetIds))
      .map((precisionsMap) => {
        const p = (assetId: string | null | undefined): number =>
          precisionsMap[wavesByDefault(assetId)];

        return txs.map((tx) => {
          const feePrecision = p(tx.feeAsset);

          const amountAssetPrecision = p(tx.order1.assetPair.amountAsset);
          const priceAssetPrecision = p(tx.order1.assetPair.priceAsset);

          // exchange v3 support
          const txPricePrecision =
            !tx.version || tx.version < 3
              ? 8 + priceAssetPrecision - amountAssetPrecision
              : 8;

          const order1MatcherFeePrecision = p(tx.order1.matcherFeeAssetId);
          // order v4 price mode support
          const order1PricePrecision =
            tx.order1.version < 4 || tx.order1.priceMode === OrderPriceMode.AssetDecimals
              ? 8 + priceAssetPrecision - amountAssetPrecision
              : 8;

          const order2MatcherFeePrecision = p(tx.order2.matcherFeeAssetId);
          // order v4 price mode support
          const order2PricePrecision =
            tx.order2.version < 4 || tx.order2.priceMode === OrderPriceMode.AssetDecimals
              ? 8 + priceAssetPrecision - amountAssetPrecision
              : 8;

          const buyMatcherFeePrecision =
            tx.order1.orderType === OrderType.Buy
              ? order1MatcherFeePrecision
              : order2MatcherFeePrecision;

          const sellMatcherFeePrecision =
            tx.order1.orderType === OrderType.Sell
              ? order1MatcherFeePrecision
              : order2MatcherFeePrecision;

          console.log(
            JSON.stringify({
              event: {
                name: 'EXCHANGE_TRANSACTION_DECIMALS',
                txId: tx.id,
                txVersion: tx.version,
                amountAssetPrecision,
                priceAssetPrecision,
                txPricePrecision: txPricePrecision,
                txFeePrecision: feePrecision,
                buyMatcherFeePrecision,
                sellMatcherFeePrecision,
                order1Version: tx.order1.version,
                order1PriceMode: tx.order1.priceMode,
                order1MatcherFeePrecision,
                order1PricePrecision,
                order2Version: tx.order2.version,
                order2PriceMode: tx.order2.priceMode,
                order2MatcherFeePrecision,
                order2PricePrecision,
              },
              timestamp: new Date().toISOString(),
            })
          );

          return {
            ...tx,
            fee: tx.fee.shiftedBy(-feePrecision),
            amount: tx.amount.shiftedBy(-amountAssetPrecision),
            price: tx.price.shiftedBy(-txPricePrecision),
            buyMatcherFee: tx.buyMatcherFee.shiftedBy(-buyMatcherFeePrecision),
            sellMatcherFee: tx.sellMatcherFee.shiftedBy(-sellMatcherFeePrecision),
            order1: {
              ...tx.order1,
              amount: tx.order1.amount.shiftedBy(-amountAssetPrecision),
              price: tx.order1.price.shiftedBy(-order1PricePrecision),
              matcherFee: tx.order1.matcherFee.shiftedBy(-order1MatcherFeePrecision),
            },
            order2: {
              ...tx.order2,
              amount: tx.order2.amount.shiftedBy(-amountAssetPrecision),
              price: tx.order2.price.shiftedBy(-order2PricePrecision),
              matcherFee: tx.order2.matcherFee.shiftedBy(-order2MatcherFeePrecision),
            },
          };
        });
      });
  };
