import { redirect } from "next/navigation";
import { getTelegramUser } from "@/lib/telegram/get-telegram-user";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import CategoryChips from "@/components/CategoryChips";
import PromoBanner from "@/components/PromoBanner";
import MembershipBanner from "@/components/MembershipBanner";
import BottomNavigation from "@/components/BottomNavigation";
import { getProducts } from "@/lib/repositories/products";
import { getStore } from "@/lib/repositories/store";
import { getCategories } from "@/lib/repositories/categories";
import { getCartCountFromCookie } from "@/lib/repositories/cart";

function getAdminUserId(): number | null {
  const adminUserId = process.env.TELEGRAM_ADMIN_USER_ID;
  if (!adminUserId) {
    return null;
  }

  const id = Number(adminUserId);
  if (!Number.isFinite(id)) {
    return null;
  }

  return id;
}

export default async function RootPage() {
  const adminUserId = getAdminUserId();
  const user = await getTelegramUser();

  const isAdmin = adminUserId !== null && user?.id === adminUserId;

  if (isAdmin) {
    redirect("/admin/dashboard");
  }

  // For customers, render the home page content directly
  const { count } = await getCartCountFromCookie();
  const [
    { data: store, error: storeError },
    { data: categories, error: categoriesError },
    { data: featuredProducts, error: featuredProductsError },
    { data: newArrivals, error: newArrivalsError },
  ] = await Promise.all([
    getStore(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 8 }),
  ]);

  if (
    storeError ||
    categoriesError ||
    featuredProductsError ||
    newArrivalsError
  ) {
    return <p>Failed to load data.</p>;
  }

  return (
    <main>
      <Header store={store} />
      <HeroBanner heroImageUrl={store.hero_image_url} />
      <CategoryChips categories={categories} />
      <PromoBanner imageUrl={store.promo_image_url} />
      {/* New arrivals */}
      <ProductSection title="New Arrivals" products={newArrivals ?? []} />
      {/* Popular this week */}
      <ProductSection
        title="Popular This Week"
        products={featuredProducts ?? []}
      />
      <MembershipBanner />
      <BottomNavigation cartCount={count} />
    </main>
  );
}
