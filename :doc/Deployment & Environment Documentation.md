# Deployment & Environment Documentation

## 1. Overview

The application is deployed as a Next.js application on Vercel and uses Supabase for its PostgreSQL database.

Telegram acts as the customer-facing application environment through the Telegram Mini App/WebApp platform.

### Deployment Architecture

```text
Customer
   │
   ▼
Telegram
   │
   │ Mini App
   ▼
Vercel
Next.js Application
   │
   ├──────────────► Telegram WebApp API
   │
   │
   └──────────────► Supabase
                    │
                    └── PostgreSQL
```

---

# 2. Production Services

| Service | Purpose |
|---|---|
| Telegram | Customer-facing Mini App environment |
| Telegram BotFather | Bot and Mini App configuration |
| Vercel | Next.js hosting/deployment |
| Supabase | PostgreSQL database |
| GitHub | Source-code repository |

---

# 3. Environment Variables

## Required

### `NEXT_PUBLIC_SUPABASE_URL`

Public Supabase project URL.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
```

This value may be exposed to the browser.

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Supabase anonymous/public key.

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

This key is intended for public/client-side Supabase access.

---

### `TELEGRAM_BOT_TOKEN`

Telegram bot token obtained through BotFather.

```env
TELEGRAM_BOT_TOKEN=<telegram-bot-token>
```

**Security:** This must remain server-side and must NOT use the `NEXT_PUBLIC_` prefix.

It is used by the server to validate Telegram Mini App `initData`.

---

### `SUPABASE_SERVICE_ROLE_KEY`

Supabase service-role secret.

```env
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

**CRITICAL SECURITY REQUIREMENT**

This key must never be exposed to client-side JavaScript.

Do NOT name it:

```env
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

It must only be consumed by server-side code.

---

# 4. Optional Development Variables

The project contains a development-only Telegram bypass mechanism.

```env
ENABLE_TELEGRAM_DEV_BYPASS=true
TELEGRAM_DEV_USER_ID=123456789
```

These variables must only be used for local development.

The bypass is restricted by the application to:

```text
NODE_ENV === "development"
```

Production/Vercel must not rely on this bypass.

---

# 5. Environment Separation

## Local Development

Store local secrets in:

```text
.env.local
```

Do not commit `.env.local` to Git.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TELEGRAM_BOT_TOKEN=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## Vercel Production

Add production environment variables through the Vercel project's Environment Variables configuration.

Required:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
TELEGRAM_BOT_TOKEN
SUPABASE_SERVICE_ROLE_KEY
```

Do not copy development bypass variables into production unless explicitly required for controlled testing.

---

# 6. Supabase Configuration

The application uses:

- Supabase PostgreSQL
- Public/anonymous access for storefront data
- Server-side service-role access for protected cart operations

## Cart Security

`cart_items` has Row Level Security enabled.

Public roles have been revoked direct table access.

Cart access therefore follows:

```text
Telegram initData
       ↓
Server validation
       ↓
Verified Telegram user ID
       ↓
Server-side Supabase service-role client
       ↓
telegram_user_id filter
       ↓
User's cart
```

The relevant migration creates a unique constraint/index over:

```text
(telegram_user_id, product_id)
```

This prevents duplicate product rows for the same Telegram user.

---

# 7. Applying Database Migrations

When a new migration is created locally, it should be applied to the linked Supabase project.

Typical command:

```bash
supabase db push
```

Alternatively, SQL migrations can be executed manually through the Supabase SQL Editor when appropriate.

After changing the database schema, regenerate TypeScript database types:

```bash
npm run update-types
```

**[CONFIRM: Exact Supabase CLI linking configuration and project reference used by this repository.]**

---

# 8. GitHub → Vercel Deployment

The repository is hosted on GitHub.

The expected deployment flow is:

```text
Local changes
     ↓
npm run build
     ↓
git add .
     ↓
git commit
     ↓
git push origin main
     ↓
GitHub
     ↓
Vercel detects push
     ↓
npm install
     ↓
npm run build
     ↓
Production deployment
```

Before pushing:

```bash
npm run build
```

must complete successfully.

---

# 9. Telegram Configuration

The Telegram bot is created/configured through BotFather.

The Mini App is connected to the production Vercel URL.

Production flow:

```text
Telegram Bot
     ↓
Mini App
     ↓
Vercel URL
     ↓
Next.js application
```

The application loads the Telegram WebApp JavaScript SDK and accesses:

```typescript
window.Telegram.WebApp.initData
```

The raw `initData` is sent to the Next.js server.

The server validates it using:

```text
TELEGRAM_BOT_TOKEN
```

The verified Telegram user ID is then used for protected customer operations.

---

# 10. Production Deployment Checklist

## Before Deployment

- [ ] `npm run build` passes.
- [ ] Database migration has been applied.
- [ ] Database types are regenerated.
- [ ] No secrets are committed to Git.
- [ ] `TELEGRAM_BOT_TOKEN` exists in Vercel.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` exists in Vercel.
- [ ] Supabase URL/key variables are configured.
- [ ] Production Mini App URL points to Vercel.

---

# 11. Post-Deployment Smoke Test

### Storefront

- [ ] Open Mini App through Telegram.
- [ ] Homepage loads.
- [ ] Products load.
- [ ] Categories work.
- [ ] Search works.
- [ ] Product details work.
- [ ] Light mode works.
- [ ] Dark mode works.

### Cart

- [ ] Add available product.
- [ ] Cart count updates.
- [ ] Open cart.
- [ ] Increase quantity.
- [ ] Decrease quantity.
- [ ] Delete item.
- [ ] Reopen Mini App.
- [ ] Cart persists.

### Security

- [ ] Test with Telegram Account A.
- [ ] Add product.
- [ ] Test with Telegram Account B.
- [ ] Confirm Account B cannot see Account A's cart.
- [ ] Confirm Account B can independently add the same product.

### Checkout

- [ ] Complete checkout.
- [ ] Verify order creation.
- [ ] Verify order items.
- [ ] Verify cart clearing.
- [ ] Verify confirmation.

### Admin

- [ ] Admin login works.
- [ ] New order appears.
- [ ] Order details are correct.
- [ ] Order status can be updated.
- [ ] Product availability/stock changes propagate correctly.

---

# 12. Rollback

If a deployment introduces a critical regression:

1. Identify the failing commit.
2. Revert the problematic change.
3. Run:

```bash
npm run build
```

4. Commit and push the rollback.
5. Verify the Vercel deployment.
6. Re-run the production smoke tests.

Database migrations require additional care because reverting application code does not automatically revert database schema changes.

---

# 13. Production Security Rules

Never expose:

```text
TELEGRAM_BOT_TOKEN
SUPABASE_SERVICE_ROLE_KEY
```

to client-side code.

Never use:

```text
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

The service-role Supabase client must remain server-only.

Telegram `initData` must be validated on the server before using the Telegram user ID for protected operations.

Client-provided:

- user IDs
- prices
- order totals
- stock quantities
- payment amounts

must never be blindly trusted.

---

# 14. Current Deployment State

**Hosting:** Vercel  
**Source:** GitHub  
**Database:** Supabase PostgreSQL  
**Customer platform:** Telegram Mini App  
**Frontend:** Next.js  
**Telegram authentication model:** Validated Telegram `initData` + server-side session cookie  
**Cart protection:** Server-side user scoping + Supabase RLS deny-all for public roles

**[CONFIRM: Final production domain, exact Vercel project name, Supabase project reference, and payment provider before production launch.]**