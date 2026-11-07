import { describe, expect, it } from 'vitest';
import { planDeployment } from './solution.js';
import { services } from './fixtures.js';
import type { ServiceDefinition } from './types.js';

describe('planDeployment', () => {
  it('groups deployable services into waves and reports the rest as blocked', () => {
    const result = planDeployment(services);

    expect(result).toEqual({
      waves: [
        ['db', 'queue'],
        ['auth', 'worker'],
        ['api'],
      ],
      blocked: ['billing', 'ledger', 'reporting'],
    });
  });

  it('blocks a service that depends on itself', () => {
    const selfDependent: ServiceDefinition[] = [
      { name: 'cache', dependsOn: ['cache'] },
      { name: 'db', dependsOn: [] },
    ];

    expect(planDeployment(selfDependent)).toEqual({
      waves: [['db']],
      blocked: ['cache'],
    });
  });

  it('blocks everything downstream of a broken dependency', () => {
    const chain: ServiceDefinition[] = [
      { name: 'edge', dependsOn: ['gateway'] },
      { name: 'gateway', dependsOn: ['mesh'] },
    ];

    expect(planDeployment(chain)).toEqual({
      waves: [],
      blocked: ['edge', 'gateway'],
    });
  });

  it('does not mutate the input services', () => {
    const input: ServiceDefinition[] = [
      { name: 'api', dependsOn: ['db'] },
      { name: 'db', dependsOn: [] },
    ];

    planDeployment(input);

    expect(input).toEqual([
      { name: 'api', dependsOn: ['db'] },
      { name: 'db', dependsOn: [] },
    ]);
  });

  it('returns an empty plan for no services', () => {
    expect(planDeployment([])).toEqual({ waves: [], blocked: [] });
  });
});
