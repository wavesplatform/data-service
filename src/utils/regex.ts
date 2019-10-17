const base58Chars: string = '[1-9A-HJ-NP-Za-km-z]+';

export const interval: RegExp = /^\d+[smhdMY]$/;
export const base58: RegExp = new RegExp(`^${base58Chars}$`);
export const assetId: RegExp = new RegExp(`^(?:${base58Chars}|WAVES)$`);
export const noControlChars: RegExp = /^[^\x00-\x1F\x7F-\x9F]*$/;
