import { isNil } from 'ramda';

export const parseArrayQuery = (strOrArr: string | string[]): string[] | undefined => {
  if (isNil(strOrArr)) return;
  else if (typeof strOrArr === 'string') {
    if (!strOrArr.length) return [];
    else return strOrArr.split(',');
  } else return strOrArr;
};
