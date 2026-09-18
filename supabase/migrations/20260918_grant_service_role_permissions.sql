-- Grant service_role permissions on orders and order_items tables
-- This is needed because service_role doesn't automatically have access to all tables

-- Grant permissions on orders table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO service_role;

-- Grant permissions on order_items table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO service_role;

-- Also grant on other tables that admin panel might need
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO service_role;

-- Grant usage on sequences (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;