import type { DeploymentPlan, ServiceDefinition } from './types.js';

/**
 * Group services into ordered deployment waves.
 *
 * See README.md for the full requirement.
 * 
*/

export function planDeployment(services: ServiceDefinition[]): DeploymentPlan {
	const waves: string[][] = [];
	const deployed = new Set();

	const serviceDefinitions = new Map<string, string[]>(
		services.map((s) => [s.name, s.dependsOn]),
	);

	const deployable = Array.from(serviceDefinitions)
		.filter(([k, v]) => !v.length)
		.map(([k, v]) => k)
		.sort();

	while (deployable.length > 0) {
		waves.push([...deployable]);

		deployable.forEach((d) => deployed.add(d));

		deployable.length = 0;

		for (const [k, v] of serviceDefinitions) {
			if (!deployed.has(k)) {
				const isDeployable = v.every((d) => deployed.has(d));
				if (isDeployable) {
					deployable.push(k);
				}
			}
		}
	}

	const blocked = Array.from(serviceDefinitions.keys())
		.filter((key) => !deployed.has(key))
		.sort();

	return {
		waves,
		blocked,
	};
}