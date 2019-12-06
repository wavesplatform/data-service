import { repeat } from 'ramda';
import { CandleInterval } from '../../../../types';

export default (tuplesCount: number): string => `
select
  p.amount_asset_id,
  p.price_asset_id,
  p.matcher,
  (select sum(wap.weighted_average_price * wap.volume) / sum(wap.volume) from 
   (
     select weighted_average_price, volume
     from candles
     where
       amount_asset_id = p.amount_asset_id
       and price_asset_id = p.price_asset_id
       and matcher = p.matcher
       and interval = '${CandleInterval.Minute1}'
       and volume > 0
       and time_start < ?
       order by time_start desc
     limit 5) as wap
  ) weighted_average_price
from (
  select
    distinct amount_asset_id,
    price_asset_id,
    matcher
    from candles
  where
    interval = '${CandleInterval.Day1}'
    and matcher = ?
    and (amount_asset_id,
	 price_asset_id) in (${repeat('(?, ?)', tuplesCount)})
  order by
    amount_asset_id,
    price_asset_id,
    matcher) as p;
`;
