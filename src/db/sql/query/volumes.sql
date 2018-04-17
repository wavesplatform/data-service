SELECT
  sum_amt.amount_asset,
  sum_amt.price_asset, (total_amt * 10 ^ (- txs_3.decimals)) AS volume
FROM (
  SELECT
    sum(txs_7.amount) AS total_amt,
    amount_asset,
    price_asset
  FROM
    txs_7
  WHERE (amount_asset, price_asset)
  IN $1:raw --first of pair
  AND txs_7.time_stamp > (now() - interval '1 day') -- last 24hours
GROUP BY
  amount_asset,
  price_asset) AS sum_amt
JOIN txs_3 ON sum_amt.amount_asset = txs_3.id
