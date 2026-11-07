# Exercise 05: Inventory Allocation

## Scenario

A warehouse holds a limited pool of stock. Multiple customer orders come in for
the same SKUs, and there isn't always enough to satisfy everyone. The
fulfillment service must decide who gets what, honoring order priority, and
report exactly how much each order received.

## Requirement 1

Implement `allocateInventory(inventory, orders)` in `solution.ts`.

Serve orders in **priority order**: lower `priority` first, ties broken by
`orderId` ascending. Each order draws from whatever stock remains when it is
served, so a higher-priority order can leave later ones short.

For each order line, allocate as much as the remaining stock for that SKU
allows (never more than requested, never negative). Then classify the order:

- `fulfilled` — every line got its full requested quantity.
- `partial` — at least one unit was allocated, but not everything requested.
- `unfulfilled` — nothing was allocated at all.

Each returned `OrderAllocation` lists its lines in the same order they appear on
the input order, each with `requested` and `allocated`.

Return allocations sorted by `orderId` ascending (note: this is the *reporting*
order, not the processing order).

### Expected behavior (from fixtures)

Stock: `widget: 10`, `gadget: 6`. Processing runs `B-200` (p1), `C-300` (p2),
`A-100` (p3):

- `B-200` takes 8 widget + 1 gadget → **fulfilled** (leaves widget 2, gadget 5).
- `C-300` wants 5 widget, only 2 left → allocates 2 → **partial** (widget 0).
- `A-100` wants 4 widget (0 left → 0) + 2 gadget (allocates 2) → **partial**.

## Constraints

- TypeScript and in-memory data structures only.
- No database, web framework, timers, or external services.
- Input may be empty; a SKU an order requests may not exist in inventory
  (treat missing stock as 0 available).
- Do not mutate the input `inventory` or `orders`.

## Files

- Edit: `exercises/05-inventory-allocation/solution.ts`
- Types: `exercises/05-inventory-allocation/types.ts`
- Fixtures: `exercises/05-inventory-allocation/fixtures.ts`

## Test command

```bash
pnpm test exercises/05-inventory-allocation/solution.test.ts
```
