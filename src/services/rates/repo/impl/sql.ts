import { repeat } from 'ramda';

export default (tuplesCount: number): string => `
select
	p.amount_asset_id,
	p.price_asset_id,
	p.matcher,
	(select avg(wap.weighted_average_price) from 
	(
	select
		weighted_average_price
	from
		candles
	where
		amount_asset_id = p.amount_asset_id
		and price_asset_id = p.price_asset_id
		and matcher = p.matcher
	        and interval_in_secs = 60
                and time_start < ?
	order by
		time_start desc
	limit 5) as wap
	) weighted_average_price
from
	(
	select
		distinct amount_asset_id,
		price_asset_id,
		matcher
	from
		candles
	where
		interval_in_secs = 86400
	        and matcher = ?
		and (amount_asset_id,
		     price_asset_id) in (${repeat('(?, ?)', tuplesCount)})
	order by
		amount_asset_id,
		price_asset_id,
		matcher) as p;
`
