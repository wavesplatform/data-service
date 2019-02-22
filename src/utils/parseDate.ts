export const parseDate = (str: string): Date =>
  new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
