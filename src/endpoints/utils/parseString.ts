export const trimmedStringIfDefined = <T>(q?: T): string | undefined =>
  typeof q === 'undefined' ? undefined : q.toString().trim();
