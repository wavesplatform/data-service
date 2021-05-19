import * as LRU from 'lru-cache';
import { BigNumber } from "@waves/data-entities";
import { Task, of as taskOf, rejected } from 'folktale/concurrency/task';

import { AppError } from "../../errorHandling";
import { WavesId } from "../..";
import { PairsService } from "../pairs";
import { MoneyFormat } from '../types';

export interface IThresholdAssetRateService {
    get(): Task<AppError, BigNumber>
};

export class ThresholdAssetRateService implements IThresholdAssetRateService {
    private cache: LRU<string, BigNumber>;

    constructor(private readonly thresholdAssetId: string, private readonly matcherAddress: string, private readonly pairsService: PairsService) {
        this.cache = new LRU({ maxAge: 60000 });
    }

    get(): Task<AppError, BigNumber> {
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
                            return rejected(AppError.Resolver(`Rate for pair WAVES/${this.thresholdAssetId} not found`));
                        }
                        this.cache.set(this.thresholdAssetId, value.weightedAveragePrice);
                        return taskOf(value.weightedAveragePrice);
                    },
                    Nothing: () => {
                        return rejected(AppError.Resolver(`Pair WAVES/${this.thresholdAssetId} not found`));
                    }
                })
            });
        } else {
            return taskOf(rate);
        }
    }
}