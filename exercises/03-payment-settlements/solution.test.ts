import { describe, expect, it } from "vitest";

import { transactions } from "./fixtures.js";
import { buildMerchantSettlements } from "./solution.js";
import type { Transaction } from "./types.js";

describe("buildMerchantSettlements", () => {
  it("nets settled transactions per merchant and currency", () => {
    expect(buildMerchantSettlements(transactions)).toEqual([
      {
        merchantId: "mrc_apex",
        currency: "EUR",
        // 4000 - 500; sorts before USD for the same merchant
        netMinor: 3500,
        transactionCount: 2,
      },
      {
        merchantId: "mrc_apex",
        currency: "USD",
        // 5000 + 2500 - 1000 (pending txn_004 excluded)
        netMinor: 6500,
        transactionCount: 3,
      },
      {
        merchantId: "mrc_bolt",
        currency: "EUR",
        // 8000 - 3000 (failed txn_007 excluded)
        netMinor: 5000,
        transactionCount: 2,
      },
      {
        merchantId: "mrc_cove",
        currency: "JPY",
        // 15000 (failed txn_013 excluded); JPY sorts before USD
        netMinor: 15000,
        transactionCount: 1,
      },
      {
        merchantId: "mrc_cove",
        currency: "USD",
        // 12000 - 2000 (pending txn_014 excluded)
        netMinor: 10000,
        transactionCount: 2,
      },
      {
        merchantId: "mrc_dawn",
        currency: "GBP",
        // 3000 - 3000 - 1000 -> negative net
        netMinor: -1000,
        transactionCount: 3,
      },
    ]);
  });

  it("returns an empty array when no transactions are settled", () => {
    const pendingOnly: Transaction[] = [
      {
        id: "txn_p1",
        merchantId: "mrc_apex",
        type: "charge",
        status: "pending",
        currency: "USD",
        amountMinor: 1000,
        createdAt: "2026-07-01T09:00:00.000Z",
      },
    ];

    expect(buildMerchantSettlements(pendingOnly)).toEqual([]);
  });

  it("allows a negative net when refunds and chargebacks exceed charges", () => {
    const overRefunded: Transaction[] = [
      {
        id: "txn_c1",
        merchantId: "mrc_dusk",
        type: "charge",
        status: "settled",
        currency: "GBP",
        amountMinor: 2000,
        createdAt: "2026-07-01T09:00:00.000Z",
      },
      {
        id: "txn_r1",
        merchantId: "mrc_dusk",
        type: "refund",
        status: "settled",
        currency: "GBP",
        amountMinor: 2500,
        createdAt: "2026-07-02T09:00:00.000Z",
      },
    ];

    expect(buildMerchantSettlements(overRefunded)).toEqual([
      {
        merchantId: "mrc_dusk",
        currency: "GBP",
        netMinor: -500,
        transactionCount: 2,
      },
    ]);
  });
});
