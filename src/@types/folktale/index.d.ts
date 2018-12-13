declare module 'folktale' {
  export interface Matchable {
    matchWith<C>(pattern: Record<string, (...args: any[]) => C>): C;
  }
}
