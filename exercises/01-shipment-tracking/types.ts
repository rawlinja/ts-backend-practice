export type TrackingEventType =
  | "LABEL_CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_EXCEPTION"
  | "ADDRESS_CORRECTION"
  | "CUSTOMS_HOLD";

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  occurredAt: string;
  type: TrackingEventType;
  city?: string;
  state?: string;
  carrierCode: string;
  customerVisible: boolean;
}

export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface ShipmentSummary {
  shipmentId: string;
  status: ShipmentStatus;
  lastEventAt: string;
  carrierCode: string;
  location: string | null;
}

