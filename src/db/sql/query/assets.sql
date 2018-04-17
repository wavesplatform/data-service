SELECT
  *
FROM
  txs_3
WHERE
  id IN ($1:csv);

