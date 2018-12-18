import { AppError } from 'errorHandling/AppError';
import { of as maybeOf, empty, Maybe } from 'folktale/maybe';
import { Ok, Error /* Result */ } from 'folktale/result';

import {
  applyToGetResult,
  applyToMgetResult,
  applyToSearchResult,
} from 'services/_common/createResolver/applyToResult';

const validate = (res: number) =>
  res === 2
    ? Ok<AppError, number>(2)
    : Error<AppError, number>(AppError.Validation('Bad value'));

describe('Application of function to db results', () => {
  describe('Get', () => {
    it('valid result', () => {
      expect(applyToGetResult(validate)(maybeOf(2))).toEqual(
        Ok<AppError, Maybe<number>>(maybeOf(2))
      );
    });
    it('invalid result', () => {
      expect(applyToGetResult(validate)(maybeOf(-1))).toEqual(
        Error<AppError, Maybe<number>>(AppError.Validation('Bad value'))
      );
    });
    it('empty result', () => {
      expect(applyToGetResult(validate)(empty())).toEqual(
        Ok<AppError, Maybe<number>>(empty())
      );
    });
  });

  describe('Mget', () => {
    it('valid results', () => {
      const results = [maybeOf<number>(2), empty<number>()];
      expect(applyToMgetResult(validate)(results)).toEqual(
        Ok<AppError, Maybe<number>[]>(results)
      );
    });
    it('invalid results', () => {
      const results = [empty<number>(), maybeOf<number>(3)];
      expect(applyToMgetResult(validate)(results)).toEqual(
        Error<AppError, Maybe<number>[]>(AppError.Validation('Bad value'))
      );
    });
    it('empty results', () => {
      const results: Maybe<number>[] = [];
      expect(applyToMgetResult(validate)(results)).toEqual(
        Ok<AppError, Maybe<number>[]>([])
      );
    });
  });

  describe('Search', () => {
    it('valid results', () => {
      const results = [2, 2];
      expect(applyToSearchResult(validate)(results)).toEqual(
        Ok<AppError, number[]>(results)
      );
    });
    it('invalid results', () => {
      const results = [2, 3];
      expect(applyToSearchResult(validate)(results)).toEqual(
        Error<AppError, number[]>(AppError.Validation('Bad value'))
      );
    });
    it('empty results', () => {
      const results: number[] = [];
      expect(applyToSearchResult(validate)(results)).toEqual(
        Ok<AppError, number[]>([])
      );
    });
  });
});
