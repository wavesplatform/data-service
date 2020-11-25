import { repeat } from 'ramda';
import { CandleInterval } from '../../../../types';

export default (tuplesCount: number): string => `
select
  p.amount_asset_id,
  p.price_asset_id,
  p.matcher,
  (select floor(sum(wap.weighted_average_price * wap.volume) / sum(wap.volume)) from 
   (
     select weighted_average_price, volume
     from candles
     where
       amount_asset_id = p.amount_asset_id
       and price_asset_id = p.price_asset_id
       and matcher_address = p.matcher
       and interval = '${CandleInterval.Minute1}'
       and volume > 0
       and time_start < ?
       order by time_start desc
     limit 5) as wap
  ) weighted_average_price
from (
  select distinct 
    c.amount_asset_id,
    c.price_asset_id,
    c.matcher_address as matcher
  from candles c
  where
    c.interval = '${CandleInterval.Day1}'
    and c.matcher_address = ?
    and (c.amount_asset_id, c.price_asset_id) in (${repeat(
      '(?, ?)',
      tuplesCount
    )})
  order by c.amount_asset_id, c.price_asset_id, c.matcher_address
) as p;
`;
