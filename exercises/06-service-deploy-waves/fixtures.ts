import type { ServiceDefinition } from './types.js';

/**
 * Deliberately shuffled so input order never matches wave order, and mixes
 * three cases: a clean dependency chain, a two-service cycle, and a service
 * pointing at a name that does not exist in the input.
 */
export const services: ServiceDefinition[] = [
  { name: 'api', dependsOn: ['auth', 'db'] },
  { name: 'billing', dependsOn: ['ledger'] },
  { name: 'db', dependsOn: [] },
  { name: 'reporting', dependsOn: ['warehouse'] },
  { name: 'auth', dependsOn: ['db'] },
  { name: 'ledger', dependsOn: ['billing'] },
  { name: 'worker', dependsOn: ['db', 'queue'] },
  { name: 'queue', dependsOn: [] },
];
