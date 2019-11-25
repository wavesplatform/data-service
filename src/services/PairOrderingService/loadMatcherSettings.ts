import { get } from 'https';
import * as Task from 'folktale/concurrency/task';
import { InitError } from '../../errorHandling';

type MatcherSettings = {
  priceAssets: string[];
  orderVersions: number[];
};

const err = (matcherSettingsURL: string, originalError?: Error) =>
  new InitError(
    `Unable to get matcher settings for ${matcherSettingsURL}. Please check the MATCHER_SETTINGS_URL env variable.`,
    { error: originalError }
  );

export const loadMatcherSettings = (
  matcherSettingsURL: string
): Task.Task<InitError, MatcherSettings> =>
  Task.task(({ resolve, reject }) =>
    get(matcherSettingsURL, res => {
      let rawData = '';
      res.on('data', (chunk: any) => (rawData += chunk));
      res.on('end', () => {
        const settings: MatcherSettings = JSON.parse(rawData);
        resolve(settings);
      });
    }).on('error', error => reject(err(matcherSettingsURL, error)))
  );
