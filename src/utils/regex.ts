const base58Chars: string = '[1-9A-HJ-NP-Za-km-z]+';

export const interval: RegExp = /^\d+[smhdMY]$/;
export const base58: RegExp = new RegExp(`^${base58Chars}$`);
export const assetId: RegExp = new RegExp(`^(?:${base58Chars}|WAVES)$`);
export const noNullChars: RegExp = /^[^\x00]*$/;

// string doesn't have null character and dangding unescaped slash at the end
export const saneForDbLike: RegExp = /^(?:[^\x00]*[^\x00\\])?(?:\\\\)*$/;
