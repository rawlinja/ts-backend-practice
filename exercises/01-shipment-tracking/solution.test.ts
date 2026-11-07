import { describe, expect, it } from "vitest";

import { trackingEvents } from "./fixtures.js";
import { buildShipmentSummaries } from "./solution.js";
import type { TrackingEvent } from "./types.js";

describe("buildShipmentSummaries", () => {
  it("returns one summary per shipment using the latest customer-visible event", () => {
    expect(buildShipmentSummaries(trackingEvents)).toEqual([
      {
        shipmentId: "shp_1001",
        status: "in_transit",
        lastEventAt: "2026-07-10T18:35:00.000Z",
        carrierCode: "UPS",
        location: "Columbus, OH",
      },
      {
        shipmentId: "shp_2002",
        status: "out_for_delivery",
        lastEventAt: "2026-07-12T09:20:00.000Z",
        carrierCode: "FDX",
        location: "San Diego, CA",
      },
      {
        shipmentId: "shp_3003",
        status: "exception",
        lastEventAt: "2026-07-12T16:55:00.000Z",
        carrierCode: "USPS",
        location: "Queens, NY",
      },
    ]);
  });

  it("ignores shipments that have no customer-visible events", () => {
    const events: TrackingEvent[] = [
      {
        id: "evt_internal_1",
        shipmentId: "shp_internal",
        occurredAt: "2026-07-13T10:00:00.000Z",
        type: "CUSTOMS_HOLD",
        city: "Memphis",
        state: "TN",
        carrierCode: "FDX",
        customerVisible: false,
      },
    ];

    expect(buildShipmentSummaries(events)).toEqual([]);
  });

  it("uses null when the latest visible event has no complete city and state", () => {
    const events: TrackingEvent[] = [
      {
        id: "evt_no_location",
        shipmentId: "shp_no_location",
        occurredAt: "2026-07-13T10:00:00.000Z",
        type: "LABEL_CREATED",
        carrierCode: "UPS",
        customerVisible: true,
      },
    ];

    expect(buildShipmentSummaries(events)).toEqual([
      {
        shipmentId: "shp_no_location",
        status: "label_created",
        lastEventAt: "2026-07-13T10:00:00.000Z",
        carrierCode: "UPS",
        location: null,
      },
    ]);
  });
});

