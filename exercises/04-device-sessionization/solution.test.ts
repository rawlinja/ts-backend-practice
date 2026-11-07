import { describe, expect, it } from "vitest";

import { events } from "./fixtures.js";
import { buildDeviceSessions } from "./solution.js";
import type { DeviceEvent } from "./types.js";

const FIVE_MINUTES = 5 * 60 * 1000;

describe("buildDeviceSessions", () => {
  it("splits a device into sessions when the inactivity gap is exceeded", () => {
    expect(buildDeviceSessions(events, FIVE_MINUTES)).toEqual([
      {
        deviceId: "dev_a",
        // a1..a3, then a 16-minute gap ends the session
        startedAt: "2026-07-01T10:00:00.000Z",
        endedAt: "2026-07-01T10:04:00.000Z",
        eventCount: 3,
        durationMs: 240000,
      },
      {
        deviceId: "dev_a",
        startedAt: "2026-07-01T10:20:00.000Z",
        endedAt: "2026-07-01T10:22:00.000Z",
        eventCount: 2,
        durationMs: 120000,
      },
      {
        deviceId: "dev_b",
        // a single event is a zero-duration session
        startedAt: "2026-07-01T09:00:00.000Z",
        endedAt: "2026-07-01T09:00:00.000Z",
        eventCount: 1,
        durationMs: 0,
      },
      {
        deviceId: "dev_c",
        // exactly gapMs apart -> still one session
        startedAt: "2026-07-01T08:00:00.000Z",
        endedAt: "2026-07-01T08:05:00.000Z",
        eventCount: 2,
        durationMs: 300000,
      },
    ]);
  });

  it("returns an empty array when there are no events", () => {
    expect(buildDeviceSessions([], FIVE_MINUTES)).toEqual([]);
  });

  it("keeps each device's sessions independent of other devices' timing", () => {
    const interleaved: DeviceEvent[] = [
      {
        deviceId: "dev_x",
        eventId: "evt_x1",
        timestamp: "2026-07-01T00:00:00.000Z",
      },
      {
        deviceId: "dev_y",
        eventId: "evt_y1",
        timestamp: "2026-07-01T00:01:00.000Z",
      },
      {
        deviceId: "dev_x",
        eventId: "evt_x2",
        timestamp: "2026-07-01T00:02:00.000Z",
      },
    ];

    expect(buildDeviceSessions(interleaved, FIVE_MINUTES)).toEqual([
      {
        deviceId: "dev_x",
        startedAt: "2026-07-01T00:00:00.000Z",
        endedAt: "2026-07-01T00:02:00.000Z",
        eventCount: 2,
        durationMs: 120000,
      },
      {
        deviceId: "dev_y",
        startedAt: "2026-07-01T00:01:00.000Z",
        endedAt: "2026-07-01T00:01:00.000Z",
        eventCount: 1,
        durationMs: 0,
      },
    ]);
  });
});
