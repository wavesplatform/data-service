import { get } from 'https';

type MatcherSettings = {
  priceAssets: string[];
  orderVersions: number[];
};

export const loadMatcherSettings = (): Promise<MatcherSettings> =>
  new Promise(resolve =>
    get('https://matcher.wavesplatform.com/matcher/settings', res => {
      let rawData = '';
      res.on('data', (chunk: any) => (rawData += chunk));
      res.on('end', () => {
        const settings = JSON.parse(rawData);
        resolve(settings);
      });
    })
  );
