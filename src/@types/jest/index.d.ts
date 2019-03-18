declare namespace jest {
  interface Matchers<R> {
    toBeJust: <T>(m: Maybe<T>) => object;
  }

  interface Expect {
    toBeJust: <T>(m: Maybe<T>) => object;
  }
}
