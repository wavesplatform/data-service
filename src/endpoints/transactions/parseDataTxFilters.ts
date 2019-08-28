import { reject, isNil } from 'ramda';
import { BigNumber } from '@waves/data-entities';
import { parseDate } from '../../utils/parseDate';
import { parseBool } from '../utils/parseBool';
import { parseArrayQuery } from '../utils/parseArrayQuery';
import { DataTxEntryType } from '../../types';

type ParseValueRequest = {
  type: DataTxEntryType;
  value?: string;
};

const parseValue = ({ type, value }: ParseValueRequest) => {
  if (type === 'boolean') return parseBool(value);
  else if (type === 'integer' && !isNil(value)) return new BigNumber(value);
  else return value;
};

export const parseFilters = ({
  ids,
  timeStart, // No default value for timestart, other way - bad for desc pagination
  timeEnd,
  sender,
  limit = '100',
  sort = 'desc',
  key,
  type,
  value,
  after,
}: {
  ids?: string | string[];
  timeStart: string;
  timeEnd: string;
  sender: string;
  limit: string;
  sort: string;
  key: string;
  type: DataTxEntryType;
  value: string;
  after: string;
}) =>
  reject(isNil, {
    ids: ids && parseArrayQuery(ids),
    timeStart: timeStart && parseDate(timeStart).getOrElse(new Date(timeStart)),
    timeEnd: timeEnd && parseDate(timeEnd).getOrElse(new Date(timeEnd)),
    limit: parseInt(limit),
    sort,
    sender,
    key,
    type,
    value: parseValue({ type, value }),
    after,
  });
