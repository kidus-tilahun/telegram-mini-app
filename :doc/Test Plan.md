# Test Plan

## 1. Purpose

This test plan validates the Telegram Mini App e-commerce MVP, with emphasis on the highest-risk areas:

1. Telegram identity
2. Cart isolation
3. Cart integrity
4. Stock validation
5. Checkout
6. Orders/order items
7. Admin integration

Testing should prioritize real Telegram accounts and mobile devices because the application is ultimately intended to operate inside Telegram.

---

# 2. Risk Priority

| Priority | Meaning                              |
| -------- | ------------------------------------ |
| P0       | Must pass before MVP launch          |
| P1       | Important; should pass before launch |
| P2       | Nice to have / post-MVP              |

---

# 3. Telegram Identity Tests

### TC-TG-001 — Valid Telegram Session

**Priority:** P0

**Steps**

1. Open Mini App through Telegram.
2. Allow WebApp to initialize.
3. Perform a cart operation.

**Expected**

- Telegram `initData` is available.
- Server validates it successfully.
- Session cookie is created.
- Cart operation succeeds.

---

### TC-TG-002 — Invalid initData

**Priority:** P0

**Expected**

- Server rejects invalid/tampered `initData`.
- No Telegram identity is accepted.
- Cart operation is rejected.

---

### TC-TG-003 — Expired initData

**Priority:** P1

**Expected**

- Expired authentication data is rejected according to the application's configured validity period.

---

### TC-TG-004 — Browser/Non-Telegram Access

**Priority:** P1

**Expected**

- Storefront can optionally remain browsable.
- Cart operations require a valid Telegram session.

---

# 4. Cart Isolation Tests

## TC-CART-001 — Two-Account Isolation

**Priority:** 🔴 P0

**Steps**

**Account A**

1. Open Mini App.
2. Add Product A.
3. Open cart.

**Account B**

1. Open Mini App using a separate Telegram account/device.
2. Open cart.

**Expected**

- Account B's cart is empty.
- Product A is NOT visible.

---

## TC-CART-002 — Same Product, Different Users

**Priority:** P0

**Steps**

1. Account A adds Product A.
2. Account B adds Product A.

**Expected**

- Both users have independent cart records.
- Database contains separate `(telegram_user_id, product_id)` records.

---

## TC-CART-003 — User A Cannot Modify User B

**Priority:** P0

**Expected**

- Changing/deleting a cart item using Account A cannot modify Account B's record.

---

## TC-CART-004 — Cart Refresh Persistence

**Priority:** P0

**Steps**

1. Add item.
2. Close/reopen Mini App.
3. Open cart.

**Expected**

- User's cart remains available.

---

## TC-CART-005 — Empty Cart

**Priority:** P1

**Expected**

- Empty state displays correctly.
- No errors occur.

---

# 5. Stock Tests

## TC-STOCK-001 — Out-of-Stock Product

**Priority:** 🔴 P0

**Expected**

- User cannot add an out-of-stock product.

---

## TC-STOCK-002 — Stock Changes After Product Added

**Priority:** P0

**Steps**

1. Add product while available.
2. Admin changes stock to unavailable.
3. Attempt checkout.

**Expected**

- Server revalidates stock.
- Checkout is rejected if insufficient stock.

---

## TC-STOCK-003 — Quantity Exceeds Stock

**Priority:** P0

**Expected**

- User cannot checkout more units than available.

---

# 6. Cart Integrity Tests

## TC-CART-006 — Quantity Increase

**Expected**

- Quantity increases by one.
- Database reflects the new quantity.

## TC-CART-007 — Quantity Decrease

**Expected**

- Quantity decreases correctly.

## TC-CART-008 — Remove Item

**Expected**

- Item disappears immediately from UI.
- Database record is removed.

## TC-CART-009 — Duplicate Add

**Expected**

- Adding the same product follows the intended quantity-increase behavior.
- Duplicate `(telegram_user_id, product_id)` records are prevented.

---

# 7. Checkout Tests

## TC-CHECKOUT-001 — Successful Checkout

**Priority:** 🔴 P0

**Expected**

- Valid cart creates exactly one order.
- Each cart product creates the correct `order_items` record.
- Correct quantities and prices are recorded.
- Cart is cleared after successful order creation.

---

## TC-CHECKOUT-002 — Empty Cart Checkout

**Priority:** P0

**Expected**

- Checkout is rejected.

---

## TC-CHECKOUT-003 — Product Deleted Before Checkout

**Priority:** P0

**Expected**

- Checkout fails safely.
- No partial order is created.

---

## TC-CHECKOUT-004 — Price Changed Before Checkout

**Priority:** P0

**Expected**

- Server uses trusted database pricing.
- Client-provided prices are never trusted.

---

## TC-CHECKOUT-005 — Stock Changed Before Checkout

**Priority:** P0

**Expected**

- Current stock is checked server-side.
- Insufficient stock prevents order creation.

---

# 8. Order Tests

## TC-ORDER-001 — Order Creation

**Priority:** P0

**Expected**

- Correct customer identity is associated with the order.
- Correct total is stored.
- Order status is initialized correctly.

**Exact orders fields/status values**

- Name
- Phone
- Address

---

## TC-ORDER-002 — Order Items

**Priority:** P0

**Expected**

- Every purchased product has the correct `order_items` record.
- Quantity and price are correct.
- Product/order relationships are valid.

---

## TC-ORDER-003 — Customer Order Isolation

**Priority:** P0

**Expected**

- Customer A cannot retrieve Customer B's orders.

---

# 9. Admin Tests

## TC-ADMIN-001 — Admin Authentication

**Priority:** P0

**Expected**

- Unauthenticated users cannot access protected admin functionality.

---

## TC-ADMIN-002 — View Orders

**Priority:** P0

**Expected**

- Admin can see newly created customer orders.

---

## TC-ADMIN-003 — Update Order Status

**Priority:** P0

**Expected**

- Admin can update order status.
- Customer-facing status reflects the update where applicable.

---

## TC-ADMIN-004 — Product Stock Management

**Priority:** P0

**Expected**

- Admin can change product availability/stock.
- Storefront reflects the change.

---

# 10. Payment Tests

If payment is included in the MVP:

### TC-PAY-001 — Successful Payment

**Priority:** P0

Expected:

- Payment provider confirms successful transaction.
- Order is marked paid only after trusted confirmation.

### TC-PAY-002 — Failed Payment

**Priority:** P0

Expected:

- Order is not incorrectly marked as paid.

### TC-PAY-003 — Payment Callback/Webhook

**Priority:** P0

Expected:

- Server validates provider callback/webhook.
- Duplicate callbacks do not create duplicate orders/payments.

### TC-PAY-004 — Amount Tampering

**Priority:** P0

Expected:

- Client cannot modify the amount being paid.

**Payment provider is going to be Chapa but Payment is not going to be available in the MVP**

---

# 11. Performance Tests

### TC-PERF-001 — Product Loading

- Storefront loads acceptably over mobile network.

### TC-PERF-002 — Add to Cart

- UI responds immediately.
- Network operation does not freeze the interface.

### TC-PERF-003 — Cart Loading

- Cart does not perform unnecessary repeated requests.

### TC-PERF-004 — Image Performance

- Product images are appropriately sized/optimized.

---

# 12. Final MVP Acceptance Test

Perform the complete journey using a real Telegram account:

**Telegram → Store → Product → Add to Cart → Cart → Checkout → Order → Confirmation → Admin Dashboard → Order Processing**

Then repeat the same process using a **second Telegram account**.

The MVP must pass the complete journey for both accounts without identity leakage, incorrect stock handling, incorrect totals, duplicate orders, or broken UI.
