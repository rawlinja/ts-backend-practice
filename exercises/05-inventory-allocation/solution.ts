import type {
	InventoryLevel,
	Order,
	OrderAllocation,
	AllocatedLine,
	OrderLine,
} from './types.js';

function allocateLine(
	byId: Map<string, number>,
	lines: OrderLine[],
): AllocatedLine[] {
	const allocatedLines: AllocatedLine[] = [];

	for (const line of lines) {
		const { sku, quantity: requested } = line;
		const available = byId.get(sku) ?? 0;
		const allocated = Math.min(available, requested);

		byId.set(sku, available - allocated);

		allocatedLines.push({ sku, requested, allocated });
	}

	return allocatedLines;
}

/**
 * See README.md for the full requirement.
 */
export function allocateInventory(
	inventory: InventoryLevel[],
	orders: Order[],
): OrderAllocation[] {
	const sortedOrders = [...orders].sort(
		(a, b) => a.priority - b.priority || a.orderId.localeCompare(b.orderId),
	);

	const bySku = new Map(inventory.map((item) => [item.sku, item.available]));
	const allocatedOrders: OrderAllocation[] = [];

	for (const order of sortedOrders) {
		const { orderId, lines } = order;
		const allocatedLines = allocateLine(bySku, lines);

		const isFulfilled = allocatedLines.every(
			(line) => line.allocated === line.requested,
		);
		const isUnfulfilled = allocatedLines.every((line) => line.allocated === 0);

		allocatedOrders.push({
			orderId,
			lines: allocatedLines,
			status: isFulfilled
				? 'fulfilled'
				: isUnfulfilled
					? 'unfulfilled'
					: 'partial',
		});
	}

	return allocatedOrders.sort((a, b) => a.orderId.localeCompare(b.orderId));
}
