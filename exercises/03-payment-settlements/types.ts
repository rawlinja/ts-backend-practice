export type TransactionType = "charge" | "refund" | "chargeback";

export type TransactionStatus = "pending" | "settled" | "failed";

/**
 * A raw payment transaction as received from the payment processor.
 *
 * `amountMinor` is always a non-negative integer expressed in the currency's
 * minor units (e.g. cents for USD). The `type` field determines whether the
 * amount adds to or subtracts from a merchant's settled balance.
 */
export interface Transaction {
  id: string;
  merchantId: string;
  type: TransactionType;
  status: TransactionStatus;
  currency: string;
  amountMinor: number;
  createdAt: string;
}

/**
 * The settled balance for a single (merchant, currency) pair.
 */
export interface MerchantSettlement {
  merchantId: string;
  currency: string;
  /**
   * Net settled amount in minor units:
   * charges add, refunds and chargebacks subtract. May be negative.
   */
  netMinor: number;
  /** Number of settled transactions included in this settlement. */
  transactionCount: number;
}
