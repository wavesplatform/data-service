import { createHash } from 'crypto';

export const md5 = (s: string): string =>
  createHash('md5')
    .update(s)
    .digest('hex');
