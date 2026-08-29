-- Cart ownership: block direct client access via anon/authenticated roles.
-- All cart access must go through the Next.js server using the service role key
-- after Telegram initData validation.

alter table public.cart_items enable row level security;

drop policy if exists "cart_items_select_own" on public.cart_items;
drop policy if exists "cart_items_insert_own" on public.cart_items;
drop policy if exists "cart_items_update_own" on public.cart_items;
drop policy if exists "cart_items_delete_own" on public.cart_items;

revoke all on table public.cart_items from anon, authenticated;

create unique index if not exists cart_items_user_product_unique
  on public.cart_items (telegram_user_id, product_id);
