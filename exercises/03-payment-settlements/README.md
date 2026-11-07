# Exercise 03: Payment Settlements

## Scenario

A payments platform receives a stream of transactions from its processor. Each
transaction belongs to a merchant and is one of three kinds: a `charge` (money
in), a `refund`, or a `chargeback` (both money back out). Transactions also
carry a lifecycle `status` and a `currency`.

The finance team needs a per-merchant settlement report so it knows how much
each merchant is actually owed.

## Requirement 1

Implement `buildMerchantSettlements` in `solution.ts`.

Given a list of `Transaction` records, return one `MerchantSettlement` per
`(merchantId, currency)` pair.

### Rules

- Only `settled` transactions count. Ignore `pending` and `failed` ones.
- `charge` amounts add to the net; `refund` and `chargeback` amounts subtract.
- Amounts are integers in minor units (cents). Keep them as integers.
- A merchant that transacts in more than one currency produces a separate
  settlement row per currency.
- `netMinor` may be negative when refunds/chargebacks exceed charges.
- `transactionCount` is the number of settled transactions included in that row.

### Output ordering

Sort the result by `merchantId` ascending, then by `currency` ascending.

## Constraints

- TypeScript, in-memory only. No database, web framework, timers, or external
  services.
- Do not mutate the input array or its elements.

## File to edit

`exercises/03-payment-settlements/solution.ts`

## Run the tests

```sh
pnpm vitest run exercises/03-payment-settlements/
```
