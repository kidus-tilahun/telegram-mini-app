# Telegram Mini App E-Commerce — Product Requirements Document

**Document Status:** MVP Development
**Version:** 1.0
**Last Updated:** 2026-08-30
**Repository:** `telegram-mini-app`
**Primary Deployment:** Vercel
**Primary Database:** Supabase PostgreSQL

---

## 1. Product Overview

### 1.1 Product Name

**Telegram Mini App E-Commerce**

### 1.2 Product Purpose

The product is a lightweight e-commerce storefront designed specifically for Ethiopian boutique businesses that already use Telegram as a primary channel for marketing and customer communication.

The core idea is **not to build another standalone e-commerce website**.

Instead, the product uses Telegram's existing ecosystem to reduce the friction between:

1. A boutique posting clothing/products in its Telegram channel.
2. A subscriber becoming interested in a product.
3. The subscriber opening the boutique's Telegram Mini App.
4. Browsing available products.
5. Adding products to a personal cart.
6. Completing checkout and eventually placing an order.

The product is intended to help boutique owners convert their existing Telegram audience into actual customers without requiring customers to call the owner or manually communicate orders through Telegram messages or phone calls.

### 1.3 MVP Strategy

The initial MVP is intentionally narrow.

The product will first be deployed to **one boutique store in Addis Ababa for free** as a real-world pilot.

The goal of the pilot is to validate:

- Whether Telegram subscribers actually use the storefront.
- Whether the Mini App reduces ordering friction.
- Whether customers complete purchases more easily than through phone/Telegram messaging.
- Whether the boutique owner finds the system useful.
- Which features are actually necessary before expanding to additional stores.

The MVP should therefore prioritize **speed, reliability, simplicity, and real-world validation** over feature breadth.

---

## 2. Problem Statement

Many Ethiopian boutique businesses already have established Telegram channels with significant subscriber audiences.

However, posting a product in a Telegram channel does not necessarily provide a structured purchasing experience.

A typical customer journey may require the customer to:

- See a product post.
- Contact the owner.
- Ask whether the product is available.
- Ask for the price or other details.
- Communicate quantity/selection.
- Provide ordering information.
- Wait for confirmation.
- Potentially repeat the process through phone calls or messages.

This creates unnecessary friction between **product discovery and purchase**.

The product addresses this by placing a structured shopping experience directly inside Telegram through a Telegram Mini App.

---

## 3. Product Vision

> **Turn Telegram's existing audience into a frictionless storefront and purchasing channel for Ethiopian boutiques.**

The long-term vision is to enable boutique businesses to sell directly to their existing Telegram communities without requiring customers to leave Telegram for a traditional e-commerce website.

---

## 4. Target Users

### 4.1 Primary Customer — Telegram Boutique Customer

A Telegram user who:

- Follows a boutique's Telegram channel.
- Discovers products through Telegram.
- Wants to browse available products.
- Wants to add products to a cart.
- Wants to place an order with minimal friction.

**Customer Goals**

- Quickly find products.
- See product information and pricing.
- Know whether an item is available.
- Add products to a personal cart.
- Review the cart.
- Complete checkout.
- Avoid unnecessary phone calls or manual messaging.

### 4.2 Primary Business User — Boutique Owner / Administrator

The boutique operator responsible for managing the storefront and orders.

The administrator should eventually be able to:

- Manage products.
- Manage categories.
- Manage inventory/stock.
- Review incoming orders.
- Update order status.
- Manage storefront content/settings.

The administrative dashboard already exists as a separate development effort and will be connected to the storefront.

**Admin (Single Role):** Unified system administrator. A single role level with unrestricted access to global management features (product/categories, inventory/stock, order management, system settings). No multi-tiered administrative permissions or RBAC are implemented for the MVP scope

---

## 5. User Roles

### 5.1 Customer

Customers interact with the storefront through Telegram.

Customer capabilities:

- Browse products.
- Search products.
- Filter/browse categories.
- View product details.
- Add products to cart.
- Update cart quantities.
- Remove cart items.
- View cart.
- Proceed to checkout.
- Place an order once checkout is implemented.

Each customer's cart must be isolated from every other customer's cart. Telegram's verified user ID is used as the customer identity for cart ownership.

### 5.2 Administrator

Administrators manage the boutique through the admin dashboard.

Expected capabilities:

- Authenticate into the admin dashboard.
- View dashboard information.
- Create/update/delete products.
- Manage categories.
- Manage stock.
- View/manage orders.
- Manage storefront settings.

The admin dashboard is being developed separately and is not yet considered fully integrated with the storefront.

---

## 6. Core MVP Features

### 6.1 Storefront Homepage

The homepage provides:

- Store branding.
- Hero content.
- Promotional content.
- Featured products.
- Product/category discovery.
- Navigation to the main shopping experience.

### 6.2 Product Catalog

Customers can:

- View products.
- View product images.
- View names.
- View prices.
- View stock/status information.
- Browse products by category.

Product catalog data is stored in Supabase.

### 6.3 Product Search

Customers can search products by name. The current implementation uses case-insensitive name matching.

### 6.4 Categories

Customers can browse products through categories.

Categories contain:

- Name.
- Slug.
- Sort order.
- Creation timestamp.

### 6.5 Product Details

Customers can open an individual product and view detailed product information. The product page provides the entry point for adding a product to the cart.

### 6.6 Customer Cart

Customers can:

- Add products.
- Increase quantity.
- Decrease quantity.
- Remove products.
- View cart contents.
- View cart count.
- View cart totals.

Cart data is persisted in Supabase.

Each cart item is associated with:

```
telegram_user_id + product_id
```

A unique database index prevents duplicate rows for the same user/product combination.

### 6.7 Telegram Identity

The storefront uses Telegram Mini App `initData` to identify customers.

Current authentication architecture:

```
Telegram WebApp
      ↓
initData
      ↓
Next.js Server Action
      ↓
HMAC validation using Telegram Bot Token
      ↓
Verified Telegram user ID
      ↓
httpOnly session cookie
      ↓
Server-side cart operations
```

The raw Telegram `initData` is validated on the server. The client must not be trusted to provide an arbitrary Telegram user ID.

### 6.8 Per-User Cart Isolation

Cart data must never be globally shared. All cart operations are scoped to the authenticated Telegram user's verified ID.

Example:

```
User A → telegram_user_id = A
User B → telegram_user_id = B

User A:
  Product X → A + X

User B:
  Product X → B + X
```

The same product can therefore exist in multiple customers' carts independently.

### 6.9 Stock Awareness

Products contain a `stock` field. The storefront must prevent customers from adding products that are unavailable/out of stock.

**Current status:** Not fully implemented.

Server-side stock validation is required so that the restriction cannot be bypassed by manipulating the client.

### 6.10 Checkout

Checkout is part of the planned MVP flow but is not yet fully implemented.

Intended flow:

```
Cart
 ↓
Checkout
 ↓
Customer information (name, address, and phone number)
 ↓
Order creation
 ↓
Order items creation
 ↓
Order confirmation
```

### 6.11 Orders

The database foundation for `orders` and `order_items` has already been created and TypeScript types have been generated. The order UI and complete checkout/order flow remain to be completed.

---

## 7. Current Technical Product Behavior

### 7.1 Public Storefront Data

The public Supabase client is used for storefront information such as products, categories, and store settings. These are intentionally public/readable storefront resources.

### 7.2 Private Customer Cart Data

Cart operations use the Next.js server and Supabase service-role client.

```
Customer
   ↓
Next.js Server Action
   ↓
Validated Telegram identity
   ↓
Server-side repository
   ↓
Supabase service-role client
   ↓
User-scoped cart query
```

Direct client access to `cart_items` is blocked by the current database permissions/RLS strategy.

---

## 8. In Scope for MVP

**Storefront:** Telegram Mini App integration, homepage, product catalog, product search, categories, product details, cart, per-user cart isolation, stock availability, checkout, order creation, order items, order confirmation.

**Telegram:** Telegram Mini App SDK/WebApp integration, server-side `initData` validation, Telegram user identification, customer session management.

**Administration:** Admin authentication, admin dashboard, product management, category management, inventory management, order management.

---

## 9. Out of Scope for Initial MVP

The following should not delay the first real-world pilot unless validation demonstrates a strong need:

- Multi-vendor marketplace functionality.
- Complex customer accounts outside Telegram.
- Loyalty programs.
- Advanced analytics.
- Recommendation engines.
- Reviews/ratings.
- Wishlist functionality.
- Advanced promotions/coupon systems.
- Complex shipping/logistics management.
- Native iOS/Android applications.
- Multi-country localization.
- Large-scale multi-store architecture.

The initial product should remain focused on:

> **Telegram → Product discovery → Cart → Checkout → Order**

---

## 10. MVP Success Criteria (Technical)

**Storefront**

- [ ] Storefront loads reliably inside Telegram.
- [ ] Products display correctly.
- [ ] Categories work.
- [ ] Search works.
- [ ] Product details work.
- [ ] Customers can add products to cart.
- [ ] Customers can modify/remove cart items.
- [ ] Cart data persists correctly.
- [ ] Cart is isolated between Telegram users.
- [ ] Out-of-stock products cannot be added.
- [ ] Checkout works.
- [ ] Orders are created correctly.
- [ ] Order items are created correctly.
- [ ] Order confirmation works.

**Telegram**

- [ ] Mini App launches correctly from the bot.
- [ ] Telegram `initData` is validated server-side.
- [ ] Correct Telegram user identity is associated with each customer.
- [ ] No Telegram bot token is exposed to the client.
- [ ] No Supabase service-role key is exposed to the client.

**Administration**

- [ ] Admin can authenticate.
- [ ] Admin can manage products.
- [ ] Admin can manage inventory.
- [ ] Admin can view/manage orders.
- [ ] Admin changes are reflected in the storefront.

---

## 11. Real-World Pilot Success Criteria

Technical completion alone is not sufficient. The first boutique pilot should answer:

1. Do Telegram subscribers actually open the Mini App?
2. Do customers browse products through it?
3. Does it reduce phone/message-based ordering?
4. Do customers successfully add products to carts?
5. Do customers complete checkout?
6. Does the boutique owner receive and process orders successfully?
7. Does the owner prefer the Mini App workflow over the previous ordering process?
8. Does the system generate measurable additional or better-structured orders?

The pilot should be used to determine which features deserve further development.

---

## 12. Performance Requirements

The storefront should feel immediate and responsive, particularly because it is intended to run inside Telegram's mobile WebView.

Target behavior:

- Fast initial storefront load.
- Product interactions should feel instantaneous.
- Add-to-cart interactions should provide immediate UI feedback.
- Cart updates should use optimistic UI where appropriate.
- Avoid unnecessary full-page refreshes.
- Avoid unnecessary database requests.
- User-specific data must not be cached across users.

The current application has reported noticeable lag and therefore performance optimization remains part of MVP hardening.

---

## 13. UX Requirements

The storefront should feel like a modern mobile shopping application rather than a conventional desktop website.

Requirements:

- Mobile-first design.
- Clear product hierarchy.
- Large, easy-to-use touch targets.
- Clear cart feedback.
- Accessible checkout flow.
- Consistent light/dark mode behavior.
- Correct spacing around Telegram/mobile navigation.
- No important controls hidden behind fixed navigation.
- Prices displayed in Ethiopian Birr (ETB).

The current visual design originated from Lovable and requires further UX/UI polishing.

---

## 14. MVP Constraints

The project intentionally prioritizes:

1. One boutique.
2. One Telegram storefront.
3. One focused customer journey.
4. Minimal infrastructure.
5. Rapid deployment.
6. Real-world validation.

The system should not be over-engineered before the first pilot provides evidence for additional requirements.

---

## 15. Product Principle

> **Do not compete with e-commerce websites. Remove the friction between a boutique's existing Telegram audience and an actual purchase.**

The product succeeds if a boutique can continue doing what it already does — posting products to Telegram — while customers gain a significantly easier way to browse and purchase those products.
