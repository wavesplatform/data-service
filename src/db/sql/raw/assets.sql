SELECT * FROM assets
WHERE asset_id IN ($1:csv);

