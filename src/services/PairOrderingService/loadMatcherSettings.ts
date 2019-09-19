import { get } from 'https';
import * as Task from 'folktale/concurrency/task';
import { InitError } from '../../errorHandling';

type MatcherSettings = {
  priceAssets: string[];
  orderVersions: number[];
};

export const loadMatcherSettings = (
  matcherSettingsURL: string
): Task.Task<InitError, MatcherSettings> =>
  Task.task(resolver => {
    try {
      get(matcherSettingsURL, res => {
        let rawData = '';
        res.on('data', (chunk: any) => (rawData += chunk));
        res.on('end', () => {
          const settings: MatcherSettings = JSON.parse(rawData);
          resolver.resolve(settings);
        });
      });
    } catch (e) {
      resolver.reject(new InitError(e));
    }
  });
