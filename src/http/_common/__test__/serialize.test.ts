import { of as maybeOf } from 'folktale/maybe';
import { BigNumber } from '@waves/data-entities';
import { list } from '../../../types/list';
import { stringify } from '../../../utils/json';
import { LSNFormat } from '../../types';
import { get, mget, search } from '../serialize';
import { HttpResponse } from '../types';
import { contentTypeWithLSN } from '../utils';

type TestItem = {
  string: string;
  number: BigNumber;
  boolean: boolean;
};
const toSerializable = (test: TestItem | null) => ({
  __type: 'test',
  data: test,
});

const UNSAFE_NUMBER = '9007199254740993';
const testItem = {
  string: 'response',
  number: new BigNumber(UNSAFE_NUMBER),
  boolean: true,
};

describe('Serializer', () => {
  describe('get', () => {
    const data = maybeOf(testItem);

    it('should correctly serialize data with number LSN Format', () => {
      const lsnFormat = LSNFormat.Number;
      expect(get(toSerializable, lsnFormat)(data)).toEqual(
        HttpResponse.Ok(stringify(lsnFormat)(toSerializable(testItem)), {
          'Content-Type': contentTypeWithLSN(lsnFormat),
        })
      );
    });

    it('should correctly serialize data with String LSN Format', () => {
      const lsnFormat = LSNFormat.String;
      expect(get(toSerializable, lsnFormat)(data)).toEqual(
        HttpResponse.Ok(stringify(lsnFormat)(toSerializable(testItem)), {
          'Content-Type': contentTypeWithLSN(lsnFormat),
        })
      );
    });
  });

  describe('mget', () => {
    const data = [maybeOf(testItem), maybeOf(testItem)];

    it('should correctly serialize data with Number LSN Format', () => {
      const lsnFormat = LSNFormat.Number;
      const response = mget(toSerializable, lsnFormat)(data);

      expect(response).toEqual(
        HttpResponse.Ok(
          stringify(lsnFormat)(list([testItem, testItem].map(toSerializable))),
          {
            'Content-Type': contentTypeWithLSN(lsnFormat),
          }
        )
      );
    });

    it('should correctly serialize data with String LSN Format', () => {
      const lsnFormat = LSNFormat.String;
      const response = mget(toSerializable, lsnFormat)(data);

      expect(response).toEqual(
        HttpResponse.Ok(
          stringify(lsnFormat)(list([testItem, testItem].map(toSerializable))),
          {
            'Content-Type': contentTypeWithLSN(lsnFormat),
          }
        )
      );
    });
  });

  describe('search', () => {
    const data = {
      items: [testItem, testItem],
      isLastPage: true,
    };

    it('should correctly serialize data with Number LSN Format', () => {
      const lsnFormat = LSNFormat.Number;
      const response = search(toSerializable, lsnFormat)(data);

      expect(response).toEqual(
        HttpResponse.Ok(
          stringify(lsnFormat)(
            list(data.items.map(toSerializable), {
              isLastPage: data.isLastPage,
            })
          ),
          {
            'Content-Type': contentTypeWithLSN(lsnFormat),
          }
        )
      );
    });

    it('should correctly serialize data with String LSN Format', () => {
      const lsnFormat = LSNFormat.String;
      const response = search(toSerializable, lsnFormat)(data);

      expect(response).toEqual(
        HttpResponse.Ok(
          stringify(lsnFormat)(
            list(data.items.map(toSerializable), {
              isLastPage: data.isLastPage,
            })
          ),
          {
            'Content-Type': contentTypeWithLSN(lsnFormat),
          }
        )
      );
    });
  });
});
