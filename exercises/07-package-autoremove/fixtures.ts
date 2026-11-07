import type { InstalledPackage } from './types.js';

/**
 * Covers four situations at once: a chain that should fully collapse
 * (`http-lib` → `socket-lib`), a shared dependency that must survive because a
 * second package still needs it (`json-lib`), a manual package that is never
 * touched (`cli-tool`), and two auto-installed packages that hold each other
 * up (`plugin-a` / `plugin-b`).
 */
export const packages: InstalledPackage[] = [
  { name: 'web-app', dependsOn: ['http-lib', 'json-lib'], manuallyInstalled: true },
  { name: 'cli-tool', dependsOn: ['json-lib'], manuallyInstalled: true },
  { name: 'http-lib', dependsOn: ['socket-lib'], manuallyInstalled: false },
  { name: 'json-lib', dependsOn: [], manuallyInstalled: false },
  { name: 'socket-lib', dependsOn: [], manuallyInstalled: false },
  { name: 'plugin-a', dependsOn: ['plugin-b'], manuallyInstalled: false },
  { name: 'plugin-b', dependsOn: ['plugin-a'], manuallyInstalled: false },
];

export const removeNames: string[] = ['web-app'];
