import { describe, expect, it } from 'vitest';
import { allocateInventory } from './solution.js';
import { inventory, orders } from './fixtures.js';
import type { InventoryLevel, Order } from './types.js';

describe('allocateInventory', () => {
  it('serves orders by priority and reports fulfilled/partial outcomes', () => {
    const result = allocateInventory(inventory, orders);

    expect(result).toEqual([
      {
        orderId: 'A-100',
        status: 'partial',
        lines: [
          { sku: 'widget', requested: 4, allocated: 0 },
          { sku: 'gadget', requested: 2, allocated: 2 },
        ],
      },
      {
        orderId: 'B-200',
        status: 'fulfilled',
        lines: [
          { sku: 'widget', requested: 8, allocated: 8 },
          { sku: 'gadget', requested: 1, allocated: 1 },
        ],
      },
      {
        orderId: 'C-300',
        status: 'partial',
        lines: [{ sku: 'widget', requested: 5, allocated: 2 }],
      },
    ]);
  });

  it('marks an order unfulfilled when no requested stock remains', () => {
    const stock: InventoryLevel[] = [{ sku: 'widget', available: 1 }];
    const twoOrders: Order[] = [
      { orderId: 'first', priority: 1, lines: [{ sku: 'widget', quantity: 1 }] },
      { orderId: 'second', priority: 2, lines: [{ sku: 'widget', quantity: 1 }] },
    ];

    const result = allocateInventory(stock, twoOrders);

    expect(result).toEqual([
      {
        orderId: 'first',
        status: 'fulfilled',
        lines: [{ sku: 'widget', requested: 1, allocated: 1 }],
      },
      {
        orderId: 'second',
        status: 'unfulfilled',
        lines: [{ sku: 'widget', requested: 1, allocated: 0 }],
      },
    ]);
  });

  it('does not mutate the input inventory', () => {
    const stock: InventoryLevel[] = [{ sku: 'widget', available: 5 }];
    allocateInventory(stock, [
      { orderId: 'o1', priority: 1, lines: [{ sku: 'widget', quantity: 3 }] },
    ]);

    expect(stock).toEqual([{ sku: 'widget', available: 5 }]);
  });

  it('returns an empty array when there are no orders', () => {
    expect(allocateInventory(inventory, [])).toEqual([]);
  });
});
