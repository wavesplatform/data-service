import { Maybe as FolktaleMaybe } from 'folktale/maybe';

declare global {
  namespace jest {
    interface FolktaleMaybeMatchers<R> extends Matchers<R> {
      toBeJust: (value: R) => R;
      toBeNothing: () => R
    }

    interface Expect {
      <T>(actual: FolktaleMaybe<T>): FolktaleMaybeMatchers<T>;
    }
  }
}
