# @sudobility/consumables_pages

React web UI components for the consumable credits system: a credit store,
purchase/usage history views, a paywall dialog, coupon pages, and a balance
badge. Styled with Tailwind utility classes (the consuming app provides
Tailwind) and themed through `@sudobility/design`.

The presentational components (`CreditStorePage`, `PurchaseHistoryPage`,
`UsageHistoryPage`, `CreditBalanceBadge`, `CreditPaywallDialog`) take all data
via props. The connected components (`RevenueCatCreditStore`,
`CreditHistoryPage`, the coupon pages) call `@sudobility/consumables_client`
hooks/clients at runtime, so the host must initialize that client first.

## Installation

Published to **GitHub Packages**, not the public npm registry. Consumers need
an `.npmrc` that points the `@sudobility` scope at GitHub Packages (with an auth
token that has `read:packages`):

```ini
@sudobility:registry=https://npm.pkg.github.com
```

```bash
bun add @sudobility/consumables_pages
```

Peer dependencies you must also install: `react`, `react-dom`,
`@sudobility/consumables_client`, `@sudobility/design`, `@sudobility/types`, and
(for `RevenueCatCreditStore` / the web adapter) `@revenuecat/purchases-js`.

### Tailwind setup

This package emits Tailwind class names but does **not** bundle Tailwind. The
consuming app must include this package's build output in its Tailwind content
sources, or the components render unstyled.

```css
/* Tailwind v4 */
@import "tailwindcss";
@source "../node_modules/@sudobility/consumables_pages/dist";
```

```js
// Tailwind v3 (tailwind.config.js)
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@sudobility/consumables_pages/dist/**/*.js",
],
```

## Usage

```tsx
import {
  CreditStorePage,
  PurchaseHistoryPage,
  UsageHistoryPage,
  CreditBalanceBadge,
} from '@sudobility/consumables_pages';

<CreditStorePage
  isAuthenticated={true}
  balance={balance}
  packages={packages}
  labels={labels}
  formatters={formatters}
  onPurchase={handlePurchase}
/>
```

## API

### Presentational components (data via props)

| Component | Description |
|-----------|-------------|
| `CreditStorePage` | Balance panel + responsive grid of credit packages with buy buttons |
| `PurchaseHistoryPage` | Responsive table/cards of purchase records with "load more" pagination |
| `UsageHistoryPage` | Responsive table/cards of usage records with "load more" pagination |
| `CreditBalanceBadge` | Inline pill badge showing credit count (for a topbar) |
| `CreditPaywallDialog` | Modal wrapping `CreditStorePage`, shown when an action is refused for lack of credits |

### Connected components (use `consumables_client` at runtime)

| Component | Description |
|-----------|-------------|
| `RevenueCatCreditStore` | Loads the localized catalog + balance and runs purchases through RevenueCat |
| `CreditHistoryPage` | Combined purchase + usage ledger; owns both history hooks and pagination |
| `RedeemCreditCouponPage` | Coupon redemption form (copy is hardcoded English) |
| `ManageCreditCouponsPage` | Coupon management view |

### Web RevenueCat adapter

Implements `consumables_client`'s `ConsumablesAdapter` for the web. Inject via
`initializeConsumables({ adapter: createConsumablesWebAdapter() })`. Exports:
`configureConsumablesWebAdapter`, `createConsumablesWebAdapter`,
`setConsumablesWebUser`, `clearConsumablesWebUser`, `hasConsumablesWebUser`.

### Types

Prop/label/formatter interfaces are exported from the package root (defined in
`src/types.ts`, plus component-local types for the coupon and history pages).
All user-facing strings go through `*Labels` props and all numeric/date
formatting through `*Formatters` props, so nothing user-visible is hardcoded in
the presentational components.

## Development

```bash
bun run build        # tsc typecheck gate -> vite lib build (ESM) -> ESM import fixup
bun run dev          # tsc --watch
bun run clean        # remove dist/
bun run typecheck    # tsc --noEmit
bun run test:unit    # vitest run (jsdom + React Testing Library)
bun run test:watch   # vitest in watch mode
bun run lint         # ESLint over src
bun run lint:fix     # ESLint with --fix
bun run format       # Prettier write over src
bun run verify       # typecheck + lint + test:unit + build
```

Use **Bun** as the package manager (not npm/yarn/pnpm).

## License

BUSL-1.1
