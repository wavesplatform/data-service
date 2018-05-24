with t as (
	select
		txs_7.time_stamp,
		amount * 10^(-aa.decimals) as amount,
		price * 10^(-8 + aa.decimals - pa.decimals) as price
	from txs_7
	join asset_decimals aa on (amount_asset = aa.asset_id)
	join asset_decimals pa on (price_asset = pa.asset_id)
	where txs_7.time_stamp between timezone('utc', now() - interval '1 day') and timezone('utc', now())
		and amount_asset || '/' || price_asset = $1
)
select
	first_price,
	last_price,
	volume
from (
	select sum(amount) as volume from t
) v
cross join (
	select price as last_price from t
	order by time_stamp desc
	limit 1
) lp
cross join (
	select price as first_price from t
	order by time_stamp asc
	limit 1
) fp;

