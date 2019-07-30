// import * as txService from '../../services/transactions/exchange'
// import * as pairsService from '../../services/pairs'
import BigNumber from '@waves/bignumber'
// import { select } from '../utils/selectors';
// import { trimmedStringIfDefined } from 'endpoints/utils/parseString';
// import { parseFilterValues } from 'endpoints/_common/filters';
// import { captureErrors } from 'utils/captureErrors';
// import { handleError } from 'utils/handleError';
import { Task, of, waitAll } from 'folktale/concurrency/task';
import { Transaction } from 'types';
import * as maybe from 'folktale/maybe';

const WavesId: string = 'WAVES';

type RateOrder = 'Straight' | 'Inverted';

type RateRequest = [string, string, RateOrder];

function map<T, R>(data: T[], fn: (val: T) => R): R[] {
  return data.reduce((acc: R[], x: T) => {
    acc.push(fn(x));
    return acc;
  }, []);
}

interface PairCheckService {
  checkPair(matcher: string, pair: [string, string]): Task<Error, maybe.Maybe<[string, string]>>
}

type TransactionServiceGetParams = {
  priceAsset: string,
  amountAsset: string,
  limit: number,
  sender: string,
}

interface TransactionService {
  get(params: TransactionServiceGetParams): Task<Error, Transaction[]>
}

const max = (data: BigNumber[]): maybe.Maybe<BigNumber> =>
  data.length === 0 ? maybe.empty() : maybe.of(BigNumber.max(...data));

export class RateEstimator {
  constructor(
    private readonly pairChecker: PairCheckService,
    private readonly transactionService: TransactionService
  ) {}

  private countRateFromTransactions([amountAsset, priceAsset, order]: RateRequest, matcher: string): Task<Error, BigNumber> {
    return this.transactionService.get(
      {
        amountAsset,
        priceAsset,
        limit: 5,
        sender: matcher,
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
  
  private getActualRate(from: string, to: string, matcher: string): Task<Error, BigNumber> {
    const requests: Task<Error, RateRequest[]> = this.pairChecker.checkPair(matcher, [from, to]).map(
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

  public getRate(from: string, to: string, matcher: string): Task<Error, BigNumber> {
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

// const rateEstimate = async ctx => {
//   const transactions = txService(
//     {
//       drivers: ctx.state.drivers,
//       emitEvent: ctx.eventBus.emit,
//     }
//   );

//   const pairs = pairsService(
//     {
//       drivers: ctx.state.drivers,
//       emitEvent: ctx.eventBus.emit,
//     }    
//   );

//   function getRate(amountAsset: string, priceAsset: string, matcher: string): Task<Error, BigNumber> {
//     const WavesId = 'WAVES';

//     if (amountAsset === priceAsset) {     
//       return of(new BigNumber(1));
//     }

//     if (from === WavesId || to === WavesId) {
//       return _getRate(from, to, matcher);
//     } else {
//       return waitAll([
//         _getRate(from, WavesId, matcher),
//         _getRate(to, WavesId, matcher)
//       ])
//         .map(([rateFrom, rateTo]: [BigNumber, BigNumber]) => {
//           return rateTo.eq(0) ? rateTo : rateFrom.div(rateTo);
//         });
//     }
//   }

//   type WithPrice = { price: number | string }
//   type Pair = {}

//   function calculateCurrentRate(trades: WithPrice[]): BigNumber {
//     return (
//       trades
//         .reduce((result: BigNumber, item: WithPrice) => {
//           return result.add(new BigNumber(item.price));
//         }, new BigNumber(0))
//         .div(trades.length)
//     );
//   };

//   function getPair(amountAsset: string, priceAsset: string, matcher: string): Task<Error, Pair> {
//     return pairs.get(
//       {
//         amountAsset,
//         priceAsset,
//         matcher,
//       }
//     );
//   }

//   function getTransactions(amountAsset: string, priceAsset: string, matcher: string): Task<Error, WithPrice[]> {
//     return transactions.get(
//       {
//         limit: 5,
//         amountAsset,
//         priceAsset,
//         sender: matcher,
//       }
//     );
//   }

//   function _getRate(fromId: string, toId: string, matcher: string): Task<Error, BigNumber> {
//     const currentRate = (trades: WithPrice[]) => {
//       return trades && trades.length ? calculateCurrentRate(trades) : new BigNumber(0);
//     };

//     return getPair(amountAsset, priceAsset, matcher)
//       .map((pair: { amountAsset: string, priceAsset: string }) => {
//         return getTransactions(pair.amountAsset, pair.priceAsset, matcher)
//           .then(currentRate)
//           .then((rate: BigNumber) => {
//             if (fromId !== pair.priceAsset) {
//               return rate;
//             } else {
//               return rate.eq(0) ? rate : new BigNumber(1).div(rate);
//             }
//           })
//           .catch(() => new BigNumber(0));
//       });
//   }  

//   const { fromParams } = select(ctx);
//   const [amountAsset, priceAsset] = fromParams(['amountAsset', 'priceAsset']);

//   const { query } = select(ctx);

//   const fValues = parseFilterValues({
//     // TODO:
//     matcher: trimmedStringIfDefined,
//   })(query);

//   if (!fValues.matcher) {
//     fValues.matcher = ctx.state.config.defaultMatcher;
//   }

//   ctx.eventBus.emit('ENDPOINT_HIT', {
//     url: ctx.originalUrl,
//     resolver: `${url}`,
//     query,
//   });

//   const results = getRate(amountAsset, priceAsset, fValues.matcher)

//   ctx.eventBus.emit('ENDPOINT_RESOLVED', {
//     value: results,
//   });

//   if (results) {
//     ctx.state.returnValue = results;
//   } else {
//     ctx.status = 404;
//   }
// };

// module.exports = captureErrors(handleError)(rateEstimate);
