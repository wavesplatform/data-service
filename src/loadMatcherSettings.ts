import { get } from 'https';
import { DataServiceConfig } from 'loadConfig';

type MatcherSettings = {
  priceAssets: string[];
  orderVersions: number[];
};

export const loadMatcherSettings = (
  options: DataServiceConfig
): Promise<MatcherSettings> =>
  new Promise(resolve =>
    get(options.matcherSettingsURL, res => {
      let rawData = '';
      res.on('data', (chunk: any) => (rawData += chunk));
      res.on('end', () => {
        const settings = JSON.parse(rawData);
        resolve(settings);
      });
    })
  );
