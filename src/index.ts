export { CreditStorePage } from './CreditStorePage';
export { RevenueCatCreditStore } from './RevenueCatCreditStore';
export { CreditPaywallDialog } from './CreditPaywallDialog';
export { PurchaseHistoryPage } from './PurchaseHistoryPage';
export { UsageHistoryPage } from './UsageHistoryPage';
export {
  CreditHistoryPage,
  type CreditHistoryPageProps,
} from './CreditHistoryPage';
export { CreditBalanceBadge } from './CreditBalanceBadge';
export {
  RedeemCreditCouponPage,
  ManageCreditCouponsPage,
} from './CreditCouponPages';

export type {
  CreditStorePageProps,
  CreditStorePageLabels,
  CreditStorePageFormatters,
  CreditPaywallDialogProps,
  CreditPaywallDialogLabels,
  PurchaseHistoryPageProps,
  PurchaseHistoryPageLabels,
  PurchaseHistoryPageFormatters,
  UsageHistoryPageProps,
  UsageHistoryPageLabels,
  UsageHistoryPageFormatters,
  CreditBalanceBadgeProps,
} from './types';
export type {
  RedeemCreditCouponPageProps,
  ManageCreditCouponsPageProps,
} from './CreditCouponPages';

export type { RevenueCatCreditStoreProps } from './RevenueCatCreditStore';

export type { ConsumableSource } from '@sudobility/types';

// Web RevenueCat adapter (implements consumables_client's ConsumablesAdapter).
// Inject via initializeConsumables({ adapter: createConsumablesWebAdapter() }).
export {
  configureConsumablesWebAdapter,
  createConsumablesWebAdapter,
  setConsumablesWebUser,
  clearConsumablesWebUser,
  hasConsumablesWebUser,
} from './adapters';
