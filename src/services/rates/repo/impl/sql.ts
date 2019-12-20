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
       amount_asset_uid = p.amount_asset_uid
       and price_asset_uid = p.price_asset_uid
       and matcher_address_uid = p.matcher_address_uid
       and interval = '${CandleInterval.Minute1}'
       and volume > 0
       and time_start < ?
       order by time_start desc
     limit 5) as wap
  ) weighted_average_price
from (
  select distinct 
    c.amount_asset_uid as amount_asset_uid,
    c.price_asset_uid as price_asset_uid,
    aa.asset_id as amount_asset_id,
    pa.asset_id as price_asset_id,
    c.matcher_address_uid as matcher_address_uid,
    a.address as matcher
  from candles c
  left join addresses a on a.uid = c.matcher_address_uid
  left join assets aa on aa.uid = c.amount_asset_uid
  left join assets pa on pa.uid = c.price_asset_uid
  where
    c.interval = '${CandleInterval.Day1}'
    and a.address = ?
    and (aa.asset_id, pa.asset_id) in (${repeat('(?, ?)', tuplesCount)})
  order by c.amount_asset_uid, c.price_asset_uid, c.matcher_address_uid
) as p;
`;
