import type { DeviceEvent } from "./types.js";

/**
 * Intentionally unsorted and interleaved across devices.
 * With a 5-minute (300000 ms) gap:
 *   dev_a -> two sessions (a 16-minute gap splits it)
 *   dev_b -> one single-event session
 *   dev_c -> one session (its two events are exactly 5 minutes apart)
 */
export const events: DeviceEvent[] = [
  {
    deviceId: "dev_a",
    eventId: "evt_a3",
    timestamp: "2026-07-01T10:04:00.000Z",
  },
  {
    deviceId: "dev_b",
    eventId: "evt_b1",
    timestamp: "2026-07-01T09:00:00.000Z",
  },
  {
    deviceId: "dev_a",
    eventId: "evt_a1",
    timestamp: "2026-07-01T10:00:00.000Z",
  },
  {
    deviceId: "dev_a",
    eventId: "evt_a5",
    timestamp: "2026-07-01T10:22:00.000Z",
  },
  {
    deviceId: "dev_a",
    eventId: "evt_a2",
    timestamp: "2026-07-01T10:02:00.000Z",
  },
  {
    deviceId: "dev_c",
    eventId: "evt_c1",
    timestamp: "2026-07-01T08:00:00.000Z",
  },
  {
    deviceId: "dev_a",
    eventId: "evt_a4",
    timestamp: "2026-07-01T10:20:00.000Z",
  },
  {
    deviceId: "dev_c",
    eventId: "evt_c2",
    timestamp: "2026-07-01T08:05:00.000Z",
  },
];
