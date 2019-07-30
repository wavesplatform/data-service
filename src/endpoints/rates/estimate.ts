import BigNumber from '@waves/bignumber'
import { select } from '../utils/selectors';
import { trimmedStringIfDefined } from 'endpoints/utils/parseString';
import { parseFilterValues } from 'endpoints/_common/filters';
import { captureErrors } from 'utils/captureErrors';
import { handleError } from 'utils/handleError';
import { Task, of, waitAll } from 'folktale/concurrency/task';
import { Transaction, ServiceSearch } from 'types';
import * as maybe from 'folktale/maybe';
import { Context } from 'koa'
import { ExchangeTxsSearchRequest } from 'services/transactions/exchange';
import { SortOrder } from 'services/_common';
import { AppError } from 'errorHandling';

const WavesId: string = 'WAVES';

type RateOrder = 'Straight' | 'Inverted';

type RateRequest = [string, string, RateOrder];

function map<T, R>(data: T[], fn: (val: T) => R): R[] {
  return data.reduce((acc: R[], x: T) => {
    acc.push(fn(x));
    return acc;
  }, []);
}

export interface PairCheckService {
  checkPair(matcher: string, pair: [string, string]): Task<AppError, maybe.Maybe<[string, string]>>
}

const max = (data: BigNumber[]): maybe.Maybe<BigNumber> =>
  data.length === 0 ? maybe.empty() : maybe.of(BigNumber.max(...data));

export class RateEstimator {
  constructor(
    private readonly transactionService: ServiceSearch<ExchangeTxsSearchRequest, Transaction>,    
    private readonly pairChecker: PairCheckService
  ) {}

  private countRateFromTransactions([amountAsset, priceAsset, order]: RateRequest, matcher: string): Task<AppError, BigNumber> {
    return this.transactionService.search(
      {
        amountAsset,
        priceAsset,
        limit: 5,
        matcher,
        sender: matcher,
        timeStart: new Date(0),
        timeEnd: new Date(),
        sort: SortOrder.Descending,
      }
    ).map(
      // TODO: fix any
      transactions => transactions.length === 0 ? new BigNumber(0) : BigNumber.sum(
        ...transactions.map((x: any) => new BigNumber(x.data.price))
      ).div(transactions.length)
    ).map(
      res => order === 'Straight' ? res : new BigNumber(1).div(res)
    )
  }
  
  private getActualRate(from: string, to: string, matcher: string): Task<AppError, BigNumber> {
    const requests: Task<AppError, RateRequest[]> = this.pairChecker.checkPair(matcher, [from, to]).map(
      (res: maybe.Maybe<[string, string]>) =>
        res.map(
          ([actualFrom, actualTo]: [string, string]): RateRequest[] => [[actualFrom, actualTo, from === actualFrom ? 'Straight' : 'Inverted']]
        )
        .getOrElse([[from, to, 'Straight'] as RateRequest, [to, from, 'Inverted'] as RateRequest])
    );

    const results = requests.map(
      data => map(data, request => this.countRateFromTransactions(request, matcher))
    )

    return results.chain(
      results => waitAll(results).map((data: BigNumber[]) => max(data).getOrElse(new BigNumber(0)))
    )
  }

  public getRate(from: string, to: string, matcher: string): Task<AppError, BigNumber> {
    if (from === to) {
      return of(new BigNumber(1));
    } if (from === WavesId || to === WavesId) {
      return this.getActualRate(from, to, matcher);
    } else {
      return waitAll(
        [
          this.getActualRate(from, WavesId, matcher),
          this.getActualRate(to, WavesId, matcher)
        ]
      ).map(([rate1, rate2]) => rate2.eq(0) ? new BigNumber(0) : rate1.div(rate2));
    }
  }
}

export const rateEstimateEndpointFactory = (uri: string,  estimator: RateEstimator) =>
  {
    const handler = async (ctx: Context) => {
      const { fromParams } = select(ctx);
      const [amountAsset, priceAsset] = fromParams(['amountAsset', 'priceAsset']);

      const { query } = select(ctx);

      const fValues = parseFilterValues({
        // TODO:
        matcher: trimmedStringIfDefined,
      })(query);

      if (!fValues.matcher) {
        fValues.matcher = ctx.state.config.defaultMatcher;
      }

      ctx.eventBus.emit('ENDPOINT_HIT', {
        url: ctx.originalUrl,
        resolver: uri,
        query,
      });

      const results = estimator.getRate(amountAsset, priceAsset, fValues.matcher)

      ctx.eventBus.emit('ENDPOINT_RESOLVED', {
        value: results,
      });

      if (results) {
        ctx.state.returnValue = results;
      } else {
        ctx.status = 404;
      }
    }

    return captureErrors(handleError)(handler);
};
