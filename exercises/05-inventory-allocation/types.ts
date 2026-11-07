/**
 * On-hand stock for a single SKU in the warehouse.
 */
export interface InventoryLevel {
  sku: string;
  available: number;
}

/**
 * One requested SKU/quantity within an order.
 */
export interface OrderLine {
  sku: string;
  quantity: number;
}

/**
 * A customer order competing for the shared inventory pool.
 *
 * `priority` is a fulfillment rank where a LOWER number is more important
 * (priority 1 is served before priority 2).
 */
export interface Order {
  orderId: string;
  priority: number;
  lines: OrderLine[];
}

export type AllocationStatus = 'fulfilled' | 'partial' | 'unfulfilled';

/**
 * How much of a single requested line the allocator was able to grant.
 */
export interface AllocatedLine {
  sku: string;
  requested: number;
  allocated: number;
}

/**
 * The allocation outcome for one order.
 *
 * - `fulfilled`: every line received its full requested quantity.
 * - `partial`: at least one unit was allocated, but not everything requested.
 * - `unfulfilled`: nothing could be allocated.
 */
export interface OrderAllocation {
  orderId: string;
  status: AllocationStatus;
  lines: AllocatedLine[];
}
