import type {
	ShipmentSummary,
	TrackingEvent,
	ShipmentStatus,
	TrackingEventType,
} from './types.js';

function normalizeStatus(type: TrackingEventType): ShipmentStatus {
	switch (type) {
		case 'ADDRESS_CORRECTION':
			return 'exception';
		case 'CUSTOMS_HOLD':
			return 'exception';
		case 'DELIVERY_EXCEPTION':
			return 'exception';
		case 'DELIVERED':
			return 'delivered';
		case 'IN_TRANSIT':
			return 'in_transit';
		case 'LABEL_CREATED':
			return 'label_created';
		case 'OUT_FOR_DELIVERY':
			return 'out_for_delivery';
		case 'PICKED_UP':
			return 'picked_up';
	}
}

function normalizeLocation(city?: string, state?: string): string | null {
	if (city === undefined || state == undefined) {
		return null;
	}

	return `${city}, ${state}`;
}

function generateShipmentSummary(
	shipmentId: string,
	type: TrackingEventType,
	occurredAt: string,
	carrierCode: string,
	city?: string,
	state?: string,
): ShipmentSummary {
	return {
		shipmentId,
		status: normalizeStatus(type),
		lastEventAt: occurredAt,
		carrierCode: carrierCode,
		location: normalizeLocation(city, state),
	};
}

export function buildShipmentSummaries(
	events: TrackingEvent[],
): ShipmentSummary[] {
	const shipmentSummaryById: Record<string, ShipmentSummary> = {};

	for (const event of events) {
		if (!event.customerVisible) {
			continue;
		}

		const { shipmentId, type, occurredAt, carrierCode, city, state } = event;

		shipmentSummaryById[shipmentId] ??= generateShipmentSummary(
			shipmentId,
			type,
			occurredAt,
			carrierCode,
			city,
			state,
		);

		const shipmentSummary = shipmentSummaryById[shipmentId];

		const lastEventAt = Date.parse(shipmentSummary.lastEventAt);

		if (lastEventAt < Date.parse(event.occurredAt)) {
			shipmentSummaryById[shipmentId] = generateShipmentSummary(
				shipmentId,
				type,
				occurredAt,
				carrierCode,
				city,
				state,
			);
		}
	}

  return Object.values<ShipmentSummary>(shipmentSummaryById).sort((a, b) =>
		a.shipmentId.localeCompare(b.shipmentId),
	);
}
