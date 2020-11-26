-- Create these indexes for data-service performance increasing 
-- specifically for your matcher (don't forget to replace matcher address)

create index if not exists txs_7_amount_asset_id_price_asset_id_uid_partial_idx
	on txs_7 (amount_asset_id, price_asset_id, uid)
	where ((sender)::text = '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3'::text);


create index if not exists txs_7_order_senders_sender_uid_partial_idx
	on public.txs_7 ((ARRAY[order1 ->> 'sender'::text, order2 ->> 'sender'::text]), uid)
	where ((sender)::text = '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3'::text);


create index if not exists txs_7_amount_asset_id_price_asset_id_uid_partial_new_idx
	on txs_7 (amount_asset_id, price_asset_id, uid)
	where ((sender)::text = '3PEjHv3JGjcWNpYEEkif2w8NXV4kbhnoGgu'::text);


create index if not exists txs_7_order_senders_sender_uid_partial_new_idx
	on public.txs_7 ((ARRAY[order1 ->> 'sender'::text, order2 ->> 'sender'::text]), uid)
	where ((sender)::text = '3PEjHv3JGjcWNpYEEkif2w8NXV4kbhnoGgu'::text);
