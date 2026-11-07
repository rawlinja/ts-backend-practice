import type { InstalledPackage, RemovalPlan } from './types.js';

/**
 * Uninstall the requested packages and reclaim anything left unneeded.
 *
 * See README.md for the full requirement.
 */
export function autoremove(
	packages: InstalledPackage[],
	removeNames: string[],
): RemovalPlan {
	const packageByName = new Map(packages.map((p) => [p.name, p]));
	const counter = buildCounter(packages);

	const removed = new Set<string>();

	const plan: RemovalPlan = {
		removed: [],
		retained: [],
	};

	const queue = removeNames.filter(n => packageByName.has(n));

	while (queue.length > 0) {
		const p = queue.pop()!;

		if (removed.has(p)) continue;
		removed.add(p);

		const dependsOn = packageByName.get(p)!.dependsOn;

		for (const d of dependsOn) {
			const dependency = packageByName.get(d);
			if (!dependency) continue;

			const count = counter.get(d)! - 1;
			counter.set(d, count);

			if (count === 0 && !dependency.manuallyInstalled) {
				queue.push(d);
			}
		}
	}

	plan.removed = Array.from(removed).toSorted();

	plan.retained = packages
		.map((p) => p.name)
		.filter((n) => !removed.has(n))
		.toSorted();
    
	return plan;
}

function buildCounter(packages: InstalledPackage[]) {
	const counter = new Map<string, number>();
	for (const p of packages) {
		for (const d of p.dependsOn) {
			if (!counter.has(d)) {
				counter.set(d, 0);
			}

			const count = counter.get(d)! + 1;
			counter.set(d, count);
		}
	}

	return counter;
}