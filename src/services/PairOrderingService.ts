import { Task, of as taskOf } from 'folktale/concurrency/task';
import { Maybe, empty as maybeEmpty } from 'folktale/maybe';
import { AppError } from 'errorHandling';

export interface PairOrderingService {
  getCorrectOrder(
    matcher: string,
    pair: [string, string]
  ): Task<AppError, Maybe<[string, string]>>;
}

export class PairOrderingServiceImpl {
  private constructor(matcherSettings: string[]) {}

  public static dummy(): Task<AppError, PairOrderingService> {
    return taskOf({
      getCorrectOrder() {
        return taskOf<AppError, Maybe<[string, string]>>(maybeEmpty());
      },
    });
  }
}
