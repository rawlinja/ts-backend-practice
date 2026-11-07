# Exercise 04: Device Session Aggregation

## Scenario

A fleet of IoT devices emits activity "heartbeat" events to your ingestion
service. Analytics needs these raw events rolled up into **sessions**: bursts of
activity from a single device, broken apart whenever a device goes quiet for
too long. The events arrive unsorted and interleaved across many devices.

## Requirement 1

Implement `buildDeviceSessions(events, gapMs)` in `solution.ts`.

Given a list of `DeviceEvent`s and an inactivity threshold `gapMs`, group each
device's events into sessions. Within a device, sort events by timestamp; a new
session starts whenever the gap to the previous event is **strictly greater
than** `gapMs`. A gap exactly equal to `gapMs` stays in the same session.

Each `DeviceSession` reports `startedAt`, `endedAt`, `eventCount`, and
`durationMs` (`endedAt - startedAt`, so a single-event session is `0`).

Return sessions sorted by `deviceId` ascending, then `startedAt` ascending.

### Expected behavior (from fixtures, `gapMs = 300000`)

- `dev_a` → two sessions (a 16-minute gap splits it): `10:00–10:04` (3 events)
  and `10:20–10:22` (2 events).
- `dev_b` → one zero-duration session (single event).
- `dev_c` → one session; its two events are exactly 5 minutes apart, so they
  are **not** split.

## Constraints

- TypeScript and in-memory data structures only.
- No database, web framework, timers, or external services.
- Input may be empty; devices are independent of each other's timing.
- Do not mutate the input array.

## Files

- Edit: `exercises/04-device-sessionization/solution.ts`
- Types: `exercises/04-device-sessionization/types.ts`
- Fixtures: `exercises/04-device-sessionization/fixtures.ts`

## Test command

```bash
pnpm test exercises/04-device-sessionization/solution.test.ts
```
