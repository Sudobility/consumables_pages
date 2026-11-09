# Consumables Pages

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it. Stay on the current branch; do not create
> feature branches for code changes.

React web UI components for the consumable-credits system (credit store,
purchase/usage history, paywall dialog, coupon pages, balance badge).

- **npm name**: `@sudobility/consumables_pages` — published to **GitHub Packages**
  (`.npmrc`: `@sudobility:registry=https://npm.pkg.github.com`), not public npm.
- **License**: BUSL-1.1

## Stack

- TypeScript (strict, `jsx: react-jsx`) targeting React 18/19. Bun is the package manager.
- **Build**: Vite library mode (ESM only, single `dist/index.js` + `.d.ts` via `vite-plugin-dts`).
- **Test**: Vitest + jsdom + React Testing Library.
- **Style**: Tailwind utility classes (host provides Tailwind); theming via `@sudobility/design`.

## Commands

```bash
bun run build        # tsc (typecheck gate) -> vite build -> scripts/fix-esm-imports.mjs
bun run dev          # tsc --watch
bun run typecheck    # bunx tsc --noEmit
bun run test:unit    # vitest run    (NOTE: `bun test` runs Bun's own runner, NOT vitest)
bun run test:watch   # vitest watch
bun run lint         # bunx eslint src   (lint:fix adds --fix)
bun run format       # prettier --write src
bun run verify       # typecheck + lint + test:unit + build
bun run clean        # rm -rf dist
```

## Architecture

Two kinds of components, both exported from `src/index.ts`:

- **Presentational** — `CreditStorePage`, `PurchaseHistoryPage`, `UsageHistoryPage`,
  `CreditBalanceBadge`, `CreditPaywallDialog`. All data, callbacks, loading/error state,
  user-facing strings (`*Labels`) and formatting (`*Formatters`) arrive via props. No internal
  data fetching, no hooks, no hardcoded copy. Prop types live in `src/types.ts`.
- **Connected** — `RevenueCatCreditStore`, `CreditHistoryPage`, `RedeemCreditCouponPage`,
  `ManageCreditCouponsPage`. These call `@sudobility/consumables_client` hooks/clients at
  runtime (e.g. `usePurchaseHistory`, `useUsageHistory`, `ConsumablesApiClient`) and render the
  presentational components with the results. The host must initialize the consumables client
  singleton before rendering these.

`src/adapters/` holds the **web RevenueCat adapter** — the web implementation of
`consumables_client`'s `ConsumablesAdapter` seam (lives here so platform-agnostic logic never
depends on a platform SDK). Inject via `initializeConsumables({ adapter: createConsumablesWebAdapter() })`.
`@revenuecat/purchases-js` is lazy-loaded.

`src/controls.ts` is the single source for every control's class string.

## Conventions

- **The design system is the only source of colour.** No palette classes (`bg-blue-600`,
  `text-white`, `bg-theme-*`) anywhere. Every control's classes come from `src/controls.ts`
  (`primaryButtonClass()`, `quietButtonClass()`, `inputClass()`), which read `variants.*` from
  `@sudobility/design`. These are **functions called during render**, never module-level
  constants — a constant computed at import time can run before the host configures its theme and
  would freeze the un-themed palette. `FIELD_HEIGHT_CLASS` (`h-11`) keeps a field and the button
  beside it the same height. `src/__tests__/design-system.test.ts` enforces all of this with an
  **empty allow list**.
- Responsive pattern: `hidden sm:block` desktop tables, `sm:hidden` mobile cards;
  `sm:grid-cols-2 lg:grid-cols-3` for the store grid. Components also ship `dark:` variants.
- No CSS files / modules / styled-components — Tailwind utilities only.

## Gotchas

- **`@sudobility/design` is a peer dep and a Vite build external — never bundled** (see the
  `external` list in `vite.config.ts`). The host calls `configureTheme()` on its own copy; a
  bundled copy is a second, unconfigured module instance that answers with the un-themed palette.
  That once shipped a blue Buy button into a red app with every test green (tests also run
  un-themed). `react`, `react-dom`, `consumables_client`, and `@sudobility/types` are external too.
- **`consumables_client` is a runtime peer dep, not types-only.** The connected components above
  call its hooks/clients; `@sudobility/types` supplies shared record types
  (`ConsumablePurchaseRecord`, `ConsumableUsageRecord`, `ConsumableSource`).
- **Host must provide & configure Tailwind** and include `dist/**/*.js` in its content sources,
  or components render unstyled (by design — Tailwind is not bundled). See README.
- **Coupon pages' copy is hardcoded English** (`CreditCouponPages.tsx`), unlike the store/history
  pages which take `labels`. A non-English host shows English there until they also take labels.
- **Build is Vite, not plain tsc.** `tsc` in the build script is only a typecheck gate
  (`tsconfig.json` has `noEmit: true`); the actual emit is `vite build`, then
  `scripts/fix-esm-imports.mjs` rewrites relative specifiers to Node-resolvable paths.
  `tsconfig.build.json` exists but is not referenced by current scripts.

## Publishing

CI (`.github/workflows/ci-cd.yml`, the shared `johnqh/workflows` unified pipeline) publishes to
GitHub Packages on push to `main`/`develop`. For a manual publish: bump `version` in
`package.json`, confirm peer-dep ranges, then `bun run build` (via `prepublishOnly`). `files`
ships `dist` and this `CLAUDE.md`.
