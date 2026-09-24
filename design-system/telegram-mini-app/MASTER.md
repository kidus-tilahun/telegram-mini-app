# MASTER — Design System: Telegram Boutique Mini App

> **Source of truth.** This document describes the visual system ACTUALLY implemented
> in the codebase (see `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/*`).
> Do not deviate from these tokens when building new screens — storefront or admin.
> Page-specific overrides live in `design-system/telegram-mini-app/pages/<page>.md`
> (none exist yet) and take precedence over this file when present.

## 1. Brand / Visual Direction

- **Product**: boutique fashion e-commerce, Telegram Mini App (mobile-first, ~390px, range 360–430px).
- **Feel**: premium, elegant, quiet luxury. Warm ivory light theme, warm charcoal dark theme, espresso primary, refined gold accent.
- **Anti-goals**: no vibrant/blocky marketing colors, no generic dashboard aesthetic, no emoji as icons, no hardcoded hex values in components — always semantic tokens.
- **Icons**: `lucide-react`, stroke-based, consistent 1.5–2 stroke weight. Decorative icons get `aria-hidden`; standalone icon controls get an accessible name.

## 2. Color Tokens [SHARED]

Defined as CSS variables in `src/app/globals.css` (`:root` = light,
`@media (prefers-color-scheme: dark)` = dark) and exposed to Tailwind via `@theme inline`
(e.g. `bg-background`, `text-foreground`, `border-border`, `bg-primary`).

| Token                                    | Role                                                                  | Light (oklch)                      | Dark (oklch)                      |
| ---------------------------------------- | --------------------------------------------------------------------- | ---------------------------------- | --------------------------------- |
| `background`                             | App/page background                                                   | `0.975 0.012 80` (warm ivory)      | `0.17 0.015 40` (warm charcoal)   |
| `foreground`                             | Primary text                                                          | `0.22 0.025 40` (espresso)         | `0.93 0.01 80` (warm off-white)   |
| `surface`                                | Recessed/secondary surface (chips, search field)                      | `0.95 0.014 78`                    | `0.21 0.015 40`                   |
| `surface-elevated`                       | Raised surface (inputs, search bar, logo disc)                        | `0.995 0.006 80`                   | `0.25 0.015 40`                   |
| `card` / `card-foreground`               | Card containers                                                       | `0.995 0.006 80` / `0.22 0.025 40` | `0.23 0.015 40` / `0.93 0.01 80`  |
| `popover` / `popover-foreground`         | Popover/overlay surfaces                                              | same as card                       | same as card                      |
| `primary` / `primary-foreground`         | Primary action & brand emphasis (inverted in dark: ivory on charcoal) | `0.26 0.03 35` / `0.98 0.01 80`    | `0.93 0.01 80` / `0.2 0.02 40`    |
| `secondary` / `secondary-foreground`     | Secondary fills (hero backdrop)                                       | `0.93 0.018 75` / `0.28 0.03 35`   | `0.3 0.02 45` / `0.93 0.01 80`    |
| `muted` / `muted-foreground`             | Subtle fills / secondary text                                         | `0.94 0.012 75` / `0.48 0.02 45`   | `0.28 0.015 45` / `0.68 0.015 50` |
| `accent` / `accent-foreground`           | Refined gold — highlights, badges, cart count, "view all" links       | `0.62 0.13 45` / `0.99 0.005 80`   | `0.72 0.12 60` / `0.2 0.02 40`    |
| `success` / `success-foreground`         | In-stock, order-placed, positive status                               | `0.55 0.13 150` / `0.98 0.01 150`  | `0.65 0.14 150` / `0.18 0.02 150` |
| `destructive` / `destructive-foreground` | Errors, out-of-stock, removal                                         | `0.55 0.18 25` / `0.99 0.005 80`   | `0.62 0.18 25` / `0.99 0.005 80`  |
| `border` / `input`                       | 1px borders and input borders                                         | `0.9 0.014 70`                     | `0.32 0.015 45`                   |
| `ring`                                   | Focus ring (matches accent)                                           | `0.62 0.13 45`                     | `0.72 0.12 60`                    |

Notes:

- **No `warning` token exists yet.** Do not invent one silently — if a screen needs it,
  add the token to `globals.css` (light + dark) first, then use it.
- Status tints use low-alpha fills: `bg-success/15`, `bg-destructive/10`, `bg-accent/10`
  with full-strength token text (`text-success`, `text-destructive`, `text-accent`).
- Theme switching is automatic via `prefers-color-scheme` (matches Telegram's theme
  behavior in the current app). All components must remain legible in both themes.

## 3. Typography [SHARED]

Loaded in `src/app/layout.tsx` via `next/font/google` and mapped in `@theme inline`:

| Token                             | Family            | Weights | Usage                                                          |
| --------------------------------- | ----------------- | ------- | -------------------------------------------------------------- |
| `--font-display` (`font-display`) | Cormorant (serif) | 400–700 | All headings (`h1`–`h4` default to it), prices, section titles |
| `--font-sans` (`font-sans`)       | Montserrat        | 300–700 | Body, labels, buttons, inputs (body default)                   |

Type scale as implemented:

| Element              | Style                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Page title (h1)      | `font-display text-3xl` (Checkout, cart "Your Bag", product name, confirmation)           |
| Section heading (h2) | `font-display text-xl` via `SectionHeading`                                               |
| Card title           | `text-sm font-medium` (sans)                                                              |
| Body                 | `text-sm`                                                                                 |
| Secondary/meta       | `text-xs text-muted-foreground`                                                           |
| Eyebrow/label        | `text-[10px] uppercase tracking-[0.18em] text-muted-foreground`                           |
| Price                | `font-display`, `text-sm` (cards) / `text-base` (cart line) / `text-3xl` (product detail) |

Rules: headings always `font-display`; never use bold sans for display headings.
Numeric values that change (quantities, prices) use `tabular-nums`.

## 4. Spacing & Layout [SHARED]

- 4/8px rhythm only (Tailwind steps: 1, 2, 3, 4, 5, 6, 8…).
- **Content container**: `max-w-md` (28rem) centered — the app is a single mobile column.
- **Horizontal gutter**: `px-5` (20px) for page-level sections.
- **Section spacing**: `mt-8` between major sections; `mb-4` between heading and content.
- **Card interior**: `p-3` (list rows) / `p-4`–`p-5` (summary cards).
- **Bottom content inset**: pages with a fixed bottom nav use `pb-32` (or `pb-36` on
  product detail) so scroll content never hides behind the nav.
- Top inset: storefront layout applies `pt-[max(env(safe-area-inset-top),0.5rem)]`.

## 5. Border Radius [SHARED]

Base `--radius: 1rem`, exposed as `radius-sm … radius-4xl` (−4px … +16px).

| Element                                   | Radius                               |
| ----------------------------------------- | ------------------------------------ |
| Buttons, chips, pills, badges, search bar | `rounded-full`                       |
| Cards, banners, images, form inputs       | `rounded-2xl` (inputs: `rounded-xl`) |
| Small thumbnails                          | `rounded-xl`                         |

## 6. Borders & Elevation [SHARED]

- **Border**: 1px `border-border` on cards, inputs, dividers. Dividers inside cards:
  `border-t border-border` (or `border-border/50` for softer item separators).
- **Shadows** (defined in `@theme inline`):
  - `--shadow-soft` → `shadow-[var(--shadow-soft)]`: cards, product tiles, search bar, chips.
  - `--shadow-float` → `shadow-[var(--shadow-float)]`: floating/fixed elements (bottom nav, sticky CTAs).
- **Glass**: `glass-nav` utility (72% `surface-elevated` + `backdrop-filter: saturate(160%) blur(20px)` + 80% border) — used by the bottom navigation pill.

## 7. Focus & Accessibility [SHARED]

- Global `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }`.
- Inputs additionally use `focus:ring-2 focus:ring-ring` with `focus:outline-none`.
- Text contrast ≥ 4.5:1 in both themes; meaningful icons ≥ 3:1.
- Color is never the only state indicator (badges pair tint + text; stock uses label).
- `prefers-reduced-motion: reduce` → all animations/transitions collapse to ~0ms
  (global rule in `globals.css`). Never add motion that breaks under this rule.
- Tap highlight disabled globally (`-webkit-tap-highlight-color: transparent`).

## 8. Motion [SHARED]

- **Entrance**: `animate-fade-up` (0.4s, `cubic-bezier(0.2, 0.8, 0.2, 1)`, 8px rise) —
  used sparingly on hero/promo/first content blocks.
- **Press feedback**: `active:scale-[0.98]` (large CTAs) / `active:scale-[0.99]` (cards) /
  `active:bg-muted` (chips, icon buttons). Feedback must not shift layout.
- **Hover** (secondary, mobile-first): `transition-colors` / `transition-transform`,
  150–300ms; image zoom on product cards `group-hover:scale-105` (300ms).
- **Loading**: `animate-spin` ring (`border-2 border-primary border-t-transparent`).

## 9. Touch Targets [SHARED]

- Minimum **44×44px** (`h-11`/`w-11` or `min-h-11`) for every tappable element.
- Primary CTAs: **h-14** (56px) full-width pills.
- Icon-only controls: full 44px hit area (e.g. cart delete button is `h-11 w-11`
  around a 16px icon).
- No clickable whitespace: interactive area = visible area (or larger).

## 10. Buttons [SHARED]

| Variant                                                                 | Classes                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary CTA** (Add to Cart, Place Order, Checkout, Continue Shopping) | `inline-flex h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98] disabled:opacity-50` |
| **Secondary** (outline)                                                 | `inline-flex h-14 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-muted`                                                       |
| **Small action** (Join, hero CTA)                                       | `inline-flex h-11 items-center rounded-full bg-surface-elevated px-5 text-sm font-medium text-foreground`                                                                                                           |
| **Icon button**                                                         | `grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors active:bg-muted`                                                                                                                  |
| **Disabled**                                                            | `disabled:opacity-50 disabled:cursor-not-allowed` + no action                                                                                                                                                       |

Rules: one primary CTA per screen; primary actions are always reachable (sticky bottom
on product detail / cart / checkout). Loading state = spinner + label inside the button
(`border-current` spinner), never a layout swap.

## 11. Forms [SHARED]

- **Input**: `h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60`.
- **Textarea**: same, `py-3`, `rows={3}`.
- **Label**: `mb-1.5 block text-sm font-medium text-foreground`; required marker is
  `text-destructive` asterisk with `aria-hidden`.
- **Error**: `role="alert"`, `rounded-xl bg-destructive/10 p-4 text-sm text-destructive`
  (inline banner above the CTA or list).
- Section headings inside forms: `font-display text-xl`.

## 12. Cards [SHARED]

- **Standard card**: `rounded-2xl border border-border bg-card p-4|5 shadow-[var(--shadow-soft)]`.
- **List row card** (cart items): `flex gap-3 rounded-2xl border border-border bg-card p-3`.
- Card text: title `text-sm font-medium text-foreground`, meta `text-xs text-muted-foreground`.
- Images inside cards: `object-cover`, rounded to match (`rounded-xl`/`rounded-2xl`).

## 13. Badges [SHARED]

`src/components/ui/Badge.tsx` — pill, `rounded-full px-3 py-1 text-xs font-medium`:

| Variant       | Classes                              | Use                       |
| ------------- | ------------------------------------ | ------------------------- |
| `neutral`     | `bg-muted text-muted-foreground`     | generic labels            |
| `success`     | `bg-success/15 text-success`         | In Stock, order status    |
| `destructive` | `bg-destructive/15 text-destructive` | Out of Stock, errors      |
| `accent`      | `bg-accent/15 text-accent`           | highlights, member labels |

## 14. Shared State Components [SHARED]

| Component           | Pattern                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/PageLoader`     | centered `min-h-[40vh]`, spinner + `text-sm text-muted-foreground` label, `role="status"`                                                                                 |
| `ui/EmptyState`     | `mt-16` centered: 80px `rounded-full bg-muted` icon disc (32px lucide, stroke 1.5) → `font-display text-2xl` title → `text-sm` description → optional primary pill action |
| `ui/ErrorState`     | `min-h-[40vh]` centered card: destructive icon → `font-display text-xl` "Something went wrong" → message                                                                  |
| `ui/SectionHeading` | `font-display text-xl` + optional `text-xs font-medium text-accent` "view all" link                                                                                       |
| `ui/Price`          | `ETB {value.toLocaleString()}` — the ONLY currency presentation; never `$`                                                                                                |

Rules: every async screen must have intentional loading/empty/error states — never raw
text or a bare spinner without a label.

## 15. Navigation [SHARED]

- **Bottom pill nav** (`BottomNavigation`): fixed, `glass-nav` rounded-full pill,
  `max-w-sm`, 3 items max, each `min-h-11` with icon (20px) + 10px label.
  - Active: `bg-primary text-primary-foreground` + `aria-current="page"`.
  - Inactive: `text-muted-foreground`.
  - Cart count: `accent` badge (`h-5 min-w-5`, `text-[10px] font-bold`).
- **Safe areas**: nav sits on `pb-[max(env(safe-area-inset-bottom),1rem)]`; fixed CTAs
  sit at `bottom-[calc(4rem+max(env(safe-area-inset-bottom),1rem))]` (above the nav).
- **Back affordance** (detail pages): `min-h-11` row, `ChevronLeft` 18px + label,
  `text-muted-foreground hover:text-foreground`.
- Icon-only nav controls always carry `aria-label`.

## 16. Storefront-Specific Patterns [STOREFRONT]

- **Product card** (`ProductCard`): `aspect-[4/5]` image tile, `rounded-2xl`,
  `shadow-soft`; name/price BELOW the image (never overlaid); out-of-stock =
  dimmed image (`opacity-60 saturate-50`) + destructive badge overlay.
- **Product grid**: `grid grid-cols-2 gap-x-3 gap-y-5`.
- **Product detail**: full-width 4:5 hero image → `font-display text-3xl` name →
  price row (`font-display text-3xl` + stock `Badge`) → quantity selector
  (pill, 44px steppers) → sticky primary "Add to Cart" CTA above the bottom nav.
- **Hero/Promo banners**: `rounded-3xl` image, dark gradient scrim
  (`from-black/55`), eyebrow + `font-display` headline + light pill CTA.
- **Category chips**: horizontal `no-scrollbar` row, `rounded-full border bg-surface-elevated px-4 py-2.5`;
  active filter chip = `bg-primary text-primary-foreground`.
- **Cart**: "Your Bag" `font-display text-3xl` heading; item rows per §12;
  sticky "Checkout · ETB total" primary pill above the nav.
- **Checkout**: form per §11 + order summary card + full-width primary "Place Order".
- **Confirmation**: success disc (`bg-success/15`, 32px check) → `font-display text-3xl`
  → detail cards (§12) → accent info panel (`bg-accent/10`) → primary + secondary CTAs.

## 17. Telegram / Mobile Environment [SHARED]

- Single-column `max-w-md` app; design at 390px, verify 360px and 430px.
- Respect `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` for all fixed UI.
- Light/dark follows `prefers-color-scheme` (Telegram parity in current app).
- One-handed use: primary actions in the bottom half / sticky bottom; nothing critical
  in the top 100px.
- `overscroll-behavior-y: none` on body (no pull-to-refresh bounce inside the app).

## 18. Implementation Notes

- Tailwind v4 (`@import "tailwindcss"`), tokens via `@theme inline` in `globals.css`.
- Utilities: `glass-nav`, `no-scrollbar`, `animate-fade-up` (all in `globals.css`).
- Admin screens MUST use the same tokens, type scale, buttons, cards, badges, and
  state components so both surfaces read as one product. Admin-specific layouts
  (sidebar, tables, dashboards) may be defined later in `pages/admin*.md` overrides.
