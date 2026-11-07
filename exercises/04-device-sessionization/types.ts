/**
 * A single heartbeat/activity event emitted by a device.
 *
 * `timestamp` is an ISO 8601 UTC string. Events may arrive out of order and
 * from many devices interleaved together.
 */
export interface DeviceEvent {
  deviceId: string;
  eventId: string;
  timestamp: string;
}

/**
 * A contiguous activity session for a single device.
 *
 * A session is a maximal run of that device's events where the gap between
 * each adjacent pair (once sorted by time) does not exceed the configured
 * inactivity gap.
 */
export interface DeviceSession {
  deviceId: string;
  /** ISO timestamp of the earliest event in the session. */
  startedAt: string;
  /** ISO timestamp of the latest event in the session. */
  endedAt: string;
  /** Number of events included in the session. */
  eventCount: number;
  /** endedAt - startedAt, in milliseconds. Zero for a single-event session. */
  durationMs: number;
}
