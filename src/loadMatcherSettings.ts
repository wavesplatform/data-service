import { get } from 'https';
import * as Task from 'folktale/concurrency/task';
import { DataServiceConfig } from './loadConfig';
import { InitError } from './errorHandling';

type MatcherSettings = {
  priceAssets: string[];
  orderVersions: number[];
};

export const loadMatcherSettings = (
  options: DataServiceConfig
): Task.Task<InitError, MatcherSettings> =>
  Task.task(resolver => {
    try {
      get(options.matcher.settingsURL, res => {
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
