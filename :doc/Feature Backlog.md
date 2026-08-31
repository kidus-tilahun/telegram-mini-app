# Feature Backlog

## 1. Overview

This backlog tracks the development of the Telegram Mini App e-commerce MVP, distinguishing completed functionality from work required to reach a production-ready storefront and connected admin system.

The MVP is intentionally narrow: launch with **one Addis Ababa boutique**, free of charge, using the boutique's existing Telegram channel audience as the primary customer acquisition channel.

---

## 2. Completed Features

### F-001 — Product Storefront

**User Story**

> As a customer, I want to browse the boutique's available products so that I can discover clothes and decide what I want to purchase.

**Status:** ✅ Completed

**Acceptance Criteria**
- Products are retrieved from Supabase.
- Products display name, image, price, and availability information.
- Products can be viewed through the storefront.
- Product listing works independently from Telegram cart functionality.

---

### F-002 — Product Categories

**User Story**

> As a customer, I want to filter products by category so that I can find relevant products quickly.

**Status:** ✅ Completed

**Acceptance Criteria**
- Categories are retrieved from Supabase.
- Customers can select/filter categories.
- Category filtering works on the storefront.

---

### F-003 — Product Search

**User Story**

> As a customer, I want to search for products so that I can quickly find a specific item.

**Status:** ✅ Implemented

**Acceptance Criteria**
- Search interface is available.
- Product results can be filtered by search input.

---

### F-004 — Telegram Mini App Integration

**User Story**

> As a customer, I want to open the boutique storefront directly inside Telegram so that I don't have to leave the Telegram ecosystem.

**Status:** ⚠️ Partially completed

**Acceptance Criteria**
- Telegram Bot is configured through BotFather.
- Mini App is connected to the deployed Vercel application.
- Telegram WebApp SDK loads.
- Telegram `initData` is obtained.
- `initData` is validated server-side.
- Telegram user identity is associated with the session.

---

### F-005 — Telegram-Based Cart Identity

**User Story**

> As a customer, I want my cart to belong only to me so that other customers cannot see or modify my cart.

**Status:** ⚠️ Implemented, requires final isolation verification/fix

**Acceptance Criteria**
- Telegram `user.id` is extracted from validated `initData`.
- Cart records contain `telegram_user_id`.
- Cart queries are filtered by Telegram user ID.
- Cart database access is restricted from the public Supabase client.
- Service-role access is server-side only.
- Two Telegram accounts must never see each other's cart.

**Known Issue**

Final two-account testing previously demonstrated that cart isolation was not behaving correctly. This remains a **P0 security/functional issue until conclusively fixed and retested**.

---

### F-006 — Add to Cart

**User Story**

> As a customer, I want to add a product to my cart so that I can purchase it later.

**Status:** ⚠️ Functionally working, requires stock validation

**Acceptance Criteria**
- Customer can add an available product.
- Existing cart quantity is increased instead of creating an unintended duplicate.
- Cart is associated with the Telegram user.
- User receives appropriate feedback after adding an item.

**Known Issue**
- Currently possible to add an out-of-stock product.

---

### F-007 — Cart Quantity Management

**User Story**

> As a customer, I want to increase or decrease quantities in my cart so that I can control how many items I want.

**Status:** ✅ Implemented

**Acceptance Criteria**
- Quantity can be increased.
- Quantity can be decreased.
- Quantity cannot become negative.
- Removing quantity to zero removes the item.
- Changes are reflected in the database.

---

### F-008 — Cart Item Removal

**User Story**

> As a customer, I want to remove an item from my cart so that I can change my purchase selection.

**Status:** ✅ Implemented

**Acceptance Criteria**
- User can remove individual cart items.
- Database record is deleted.
- UI updates immediately/optimistically.

---

### F-009 — Optimistic Cart UI

**User Story**

> As a customer, I want cart interactions to feel immediate so that the app does not feel slow.

**Status:** ✅ Partially implemented

**Acceptance Criteria**
- Quantity changes update the UI optimistically.
- Item deletion updates the UI optimistically.
- Server state is synchronized afterward.

**Remaining Work**
- Reduce server/network latency perceived throughout the storefront.

---

### F-010 — Cart Database Protection

**User Story**

> As the system owner, I want customers to be prevented from directly accessing other customers' cart records.

**Status:** ✅ Implemented

**Acceptance Criteria**
- `cart_items` has RLS enabled.
- Public `anon`/`authenticated` roles cannot directly access cart records.
- Cart operations use the server-side service-role client.
- Telegram identity is validated before cart operations.

---

# 3. Remaining MVP Work

## F-011 — Fix Cart Isolation

**Priority:** 🔴 P0

**User Story**

> As a customer, I want my cart to be completely isolated from every other Telegram user.

**Acceptance Criteria**
- Account A adds Product X.
- Account B opens the Mini App.
- Account B's cart does not contain Product X.
- Account B can add Product X independently.
- Account A's cart remains unchanged.
- Updating/deleting an item from Account B cannot affect Account A.
- Tests pass across separate Telegram accounts/devices.

---

## F-012 — Stock Validation

**Priority:** 🔴 P0

**User Story**

> As a customer, I should not be able to add a product that is unavailable.

**Acceptance Criteria**
- Out-of-stock products cannot be added.
- Add-to-cart button is disabled or replaced with an unavailable state.
- Server-side validation also prevents manipulation through direct requests.
- Existing cart quantities cannot exceed available stock where stock tracking is implemented.

---

## F-013 — Storefront UI/UX Polish

**Priority:** 🟠 P1

**User Story**

> As a customer, I want the storefront to look polished and work naturally in both light and dark mode.

**Acceptance Criteria**
- No overlapping elements.
- Bottom navigation does not hide important controls.
- Product pages work correctly on mobile screen sizes.
- Light mode is visually consistent.
- Dark mode is visually consistent.
- Typography, spacing, buttons, cards, and navigation follow one design system.
- Telegram Mini App environment is considered in the design.

---

## F-014 — Storefront Performance Optimization

**Priority:** 🟠 P1

**User Story**

> As a customer, I want interactions to feel instant even on a mobile connection.

**Acceptance Criteria**
- Product navigation feels responsive.
- Cart actions provide immediate feedback.
- Unnecessary server requests are removed.
- Images are optimized.
- Loading states are intentional rather than blank.
- Repeated data fetching is minimized.
- Production performance is tested inside Telegram.

---

## F-015 — Checkout

**Priority:** 🔴 P0

**User Story**

> As a customer, I want to submit my cart as an order so that the boutique can fulfill my purchase.

**Acceptance Criteria**
- Customer can review cart.
- Customer enters required checkout information.
- Server validates cart contents and prices.
- Stock is revalidated.
- Order is created.
- Corresponding `order_items` are created.
- Cart is cleared only after successful order creation.

---

## F-016 — Order Confirmation

**Priority:** 🔴 P0

**User Story**

> As a customer, I want confirmation that my order was successfully submitted.

**Acceptance Criteria**
- Successful order produces an order confirmation.
- Customer receives order/reference information.
- Order status is displayed.
- Failed orders do not silently appear as successful.

---

## F-017 — Admin Dashboard Integration

**Priority:** 🔴 P0

**User Story**

> As a boutique owner/admin, I want to manage products and orders so that I can operate the store.

**Status:** 🟡 Dashboard reportedly already built; integration remains.

**Acceptance Criteria**
- Admin authentication works.
- Admin can view orders.
- Admin can view order items.
- Admin can manage product availability/stock.
- Admin can update order status.
- Admin can manage products/categories as applicable.
- Customer orders are correctly reflected in the dashboard.

---

## F-018 — Production Security Review

**Priority:** 🔴 P0

**Acceptance Criteria**
- Bot token is never exposed to the browser.
- Supabase service-role key is never exposed to the browser.
- Telegram `initData` is validated server-side.
- Cart access is user-scoped.
- Order access is user/admin scoped.
- Client-controlled prices are never trusted.
- Stock is validated server-side.

---

# 4. Post-MVP / Out of Current MVP

These should not block the first boutique launch:

- Multiple-store/multi-tenant architecture
- Advanced analytics
- Automated marketing campaigns
- Loyalty programs
- Complex discount engine
- Reviews/ratings
- Wishlist
- Recommendation engine
- Advanced inventory management
- Delivery-provider integrations
- Multiple payment-provider integrations
- Native mobile application
- Full Supabase Auth integration if not required by the MVP

---

# 5. MVP Definition of Done

The storefront MVP is considered ready when:

1. Customers can open the store from Telegram.
2. Products/categories/search work.
3. Telegram identity is reliably established.
4. Cart is completely isolated per Telegram account.
5. Out-of-stock products cannot be purchased.
6. Cart operations feel responsive.
7. UI works correctly in light and dark mode.
8. Checkout creates valid orders and order items.
9. Customer receives confirmation.
10. Admin can see and process those orders.
11. Critical security tests pass.
12. The complete flow works on real Telegram accounts and mobile devices.