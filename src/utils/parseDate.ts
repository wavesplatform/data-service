export const parseDate = (str: string) =>
  new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
