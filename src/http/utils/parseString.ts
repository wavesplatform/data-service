export const trimmedStringIfDefined = <T extends Object>(
  q?: T
): string | undefined =>
  typeof q === 'undefined' ? undefined : q.toString().trim();
