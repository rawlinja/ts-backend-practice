import type { InventoryLevel, Order } from './types.js';

export const inventory: InventoryLevel[] = [
  { sku: 'widget', available: 10 },
  { sku: 'gadget', available: 6 },
];

/**
 * Deliberately ordered so that `orderId` sort order (A, B, C) differs from
 * `priority` processing order (B, C, A).
 */
export const orders: Order[] = [
  {
    orderId: 'A-100',
    priority: 3,
    lines: [
      { sku: 'widget', quantity: 4 },
      { sku: 'gadget', quantity: 2 },
    ],
  },
  {
    orderId: 'B-200',
    priority: 1,
    lines: [
      { sku: 'widget', quantity: 8 },
      { sku: 'gadget', quantity: 1 },
    ],
  },
  {
    orderId: 'C-300',
    priority: 2,
    lines: [{ sku: 'widget', quantity: 5 }],
  },
];
