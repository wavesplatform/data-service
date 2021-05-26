import * as LRU from 'lru-cache';
import { BigNumber } from "@waves/data-entities";
import { Task, of as taskOf } from 'folktale/concurrency/task';
import { empty, of as maybeOf, Maybe } from 'folktale/maybe';

import { AppError } from "../../errorHandling";
import { WavesId } from "../..";
import { PairsService } from "../pairs";
import { MoneyFormat } from '../types';

type LogRow = {
    message: string,
    data: any
};

type Logger = (l: LogRow) => void;

export interface IThresholdAssetRateService {
    get(): Task<AppError, Maybe<BigNumber>>
};

export class ThresholdAssetRateService implements IThresholdAssetRateService {
    private cache: LRU<string, BigNumber>;

    constructor(private readonly thresholdAssetId: string, private readonly matcherAddress: string, private readonly pairsService: PairsService, private readonly logger: Logger) {
        this.cache = new LRU({ maxAge: 60000 });
    }

    get(): Task<AppError, Maybe<BigNumber>> {
        let rate = this.cache.get(this.thresholdAssetId);
        if (rate === undefined) {
            // rate was not set or is stale
            return this.pairsService.get({
                pair: {
                    amountAsset: WavesId,
                    priceAsset: this.thresholdAssetId,
                }, matcher: this.matcherAddress, moneyFormat: MoneyFormat.Long
            }).chain(m => {
                return m.matchWith({
                    Just: ({ value }) => {
                        if (value === null) {
                            this.logger({
                                message: 'GET_THRESHOLD_RATE',
                                data: `Rate for pair WAVES/${this.thresholdAssetId} not found`
                            });
                            return taskOf(empty());
                        }
                        this.cache.set(this.thresholdAssetId, value.weightedAveragePrice);
                        return taskOf(maybeOf(value.weightedAveragePrice));
                    },
                    Nothing: () => {
                        this.logger({
                            message: 'GET_THRESHOLD_RATE',
                            data: `Pair WAVES/${this.thresholdAssetId} not found`
                        });
                        return taskOf(empty());
                    }
                })
            });
        } else {
            return taskOf(maybeOf(rate));
        }
    }
}