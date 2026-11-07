# TypeScript Backend Practice

Timed exercises in practical backend coding: validating, transforming, grouping and reconciling records, written in the style of a real interview rather than algorithm puzzles.

## How this repo works

Each exercise is a 45-minute practice round in the style of a practical backend interview.

- **Exercise scaffolding** (problem statement, types, fixtures, tests) was generated with Claude acting as the interviewer.
- **Every `solution.ts` is my own implementation**, written without AI-generated code. Claude reviewed it only after the tests passed.

## Exercises

| # | Exercise | Scenario |
|---|---|---|
| 01 | [Shipment Tracking](exercises/01-shipment-tracking) | Build a customer-facing status view from carrier events that arrive out of order |
| 02 | [Lab Result Alerts](exercises/02-lab-result-alerts) | Build a provider review queue of finalized lab results outside the reference range |
| 03 | [Payment Settlements](exercises/03-payment-settlements) | Settle merchant charges, refunds and chargebacks across currencies |
| 04 | [Device Session Aggregation](exercises/04-device-sessionization) | Roll unsorted IoT heartbeat events up into per-device activity sessions |
| 05 | [Inventory Allocation](exercises/05-inventory-allocation) | Allocate limited warehouse stock across competing orders by priority |
| 06 | [Service Deploy Waves](exercises/06-service-deploy-waves) | Plan parallel deploy waves for interdependent services, holding back broken ones |
| 07 | [Package Autoremove](exercises/07-package-autoremove) | Work out which auto-installed packages can be removed after an uninstall |

Each folder has a `README.md` (the requirement), `types.ts`, `fixtures.ts`, `solution.ts` and `solution.test.ts`.

## Stack

TypeScript (strict, `noUncheckedIndexedAccess`) · Node 26 · Vitest · pnpm. No frameworks or runtime dependencies.

## Running

```bash
pnpm install
pnpm test        # all exercises
pnpm typecheck
pnpm test exercises/05-inventory-allocation   # one exercise
```
