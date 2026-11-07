import type { DeviceEvent, DeviceSession } from './types.js';

/**
 * Group device events into activity sessions.
 *
 * A new session begins whenever the gap between a device's adjacent events
 * (sorted ascending by timestamp) is strictly greater than `gapMs`.
 *
 * @param events unsorted, interleaved events from many devices
 * @param gapMs  maximum allowed inactivity gap, in milliseconds, within a session
 */

function sortEvents(events: DeviceEvent[]): DeviceEvent[] {
	return [...events].sort(
		(a, b) =>
			a.deviceId.localeCompare(b.deviceId) ||
			Date.parse(a.timestamp) - Date.parse(b.timestamp),
	);
}

function generateNewSession(event: DeviceEvent): DeviceSession {
	const { deviceId, timestamp } = event;

	return {
		deviceId,
		startedAt: timestamp,
		endedAt: timestamp,
		eventCount: 1,
		durationMs: 0,
	};
}

export function buildDeviceSessions(
	events: DeviceEvent[],
	gapMs: number,
): DeviceSession[] {
	const deviceSessionById = new Map<string, DeviceSession[]>();

	const sortedEvents = sortEvents(events);

	for (const event of sortedEvents) {
		const { deviceId, timestamp } = event;

		if (!deviceSessionById.has(deviceId)) {
			deviceSessionById.set(deviceId, [generateNewSession(event)]);

			continue;
		}

		const sessions = deviceSessionById.get(deviceId)!;
		const currentSession = sessions.at(-1)!;
		const gap = Date.parse(timestamp) - Date.parse(currentSession.endedAt);

		const isLessThanGapMs = gap <= gapMs;

		if (isLessThanGapMs) {
			const { eventCount: count } = currentSession;
			const durationMs =
				Date.parse(timestamp) - Date.parse(currentSession.startedAt);

			currentSession.endedAt = timestamp;
			currentSession.eventCount = count + 1;
			currentSession.durationMs = durationMs;

			continue;
		}

		sessions.push(generateNewSession(event));
	}

	return Array.from(deviceSessionById.values()).flatMap((item) => item);
}

//import {events} from './fixtures.js'

//console.log(sortEventByDeviceIdAndTimestamp(events));
