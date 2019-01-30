import { AppError } from '../../../../errorHandling/';
import { of as maybeOf, empty, Maybe } from 'folktale/maybe';
import { Ok, Error /* Result */ } from 'folktale/result';

import { applyValidation, applyTransformation } from '../applyToResult';

describe('Application of functions to db results', () => {
  describe('validation', () => {
    const validate = (res: number) =>
      res === 2
        ? Ok<AppError, number>(2)
        : Error<AppError, number>(AppError.Validation('Bad value'));
    describe('Get', () => {
      it('valid result', () => {
        expect(applyValidation.get(validate)(maybeOf(2))).toEqual(
          Ok<AppError, Maybe<number>>(maybeOf(2))
        );
      });
      it('invalid result', () => {
        expect(applyValidation.get(validate)(maybeOf(-1))).toEqual(
          Error<AppError, Maybe<number>>(AppError.Validation('Bad value'))
        );
      });
      it('empty result', () => {
        expect(applyValidation.get(validate)(empty())).toEqual(
          Ok<AppError, Maybe<number>>(empty())
        );
      });
    });

    describe('Mget', () => {
      it('valid results', () => {
        const results = [maybeOf<number>(2), empty<number>()];
        expect(applyValidation.mget(validate)(results)).toEqual(
          Ok<AppError, Maybe<number>[]>(results)
        );
      });
      it('invalid results', () => {
        const results = [empty<number>(), maybeOf<number>(3)];
        expect(applyValidation.mget(validate)(results)).toEqual(
          Error<AppError, Maybe<number>[]>(AppError.Validation('Bad value'))
        );
      });
      it('empty results', () => {
        const results: Maybe<number>[] = [];
        expect(applyValidation.mget(validate)(results)).toEqual(
          Ok<AppError, Maybe<number>[]>([])
        );
      });
    });

    describe('Search', () => {
      it('valid results', () => {
        const results = [2, 2];
        expect(applyValidation.search(validate)(results)).toEqual(
          Ok<AppError, number[]>(results)
        );
      });
      it('invalid results', () => {
        const results = [2, 3];
        expect(applyValidation.search(validate)(results)).toEqual(
          Error<AppError, number[]>(AppError.Validation('Bad value'))
        );
      });
      it('empty results', () => {
        const results: number[] = [];
        expect(applyValidation.search(validate)(results)).toEqual(
          Ok<AppError, number[]>([])
        );
      });
    });
  });

  describe('transformation', () => {
    const transform = (res: number) => res.toString();

    describe('Get', () => {
      it('valid result', () => {
        expect(applyTransformation.get(transform)(maybeOf(2))).toEqual('2');
      });
      it('empty result', () => {
        expect(applyTransformation.get(transform)(empty())).toBeNull();
      });
    });
    describe('Mget', () => {
      it('valid result', () => {
        expect(
          applyTransformation.mget(transform)([maybeOf(2), empty(), maybeOf(3)])
        ).toEqual(['2', null, '3']);
      });
      it('empty result', () => {
        expect(applyTransformation.mget(transform)([])).toEqual([]);
      });
    });
  });
});
