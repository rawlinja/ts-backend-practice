import { describe, expect, it } from 'vitest';
import { autoremove } from './solution.js';
import { packages, removeNames } from './fixtures.js';
import type { InstalledPackage } from './types.js';

describe('autoremove', () => {
  it('reclaims an orphaned chain while keeping a still-needed dependency', () => {
    expect(autoremove(packages, removeNames)).toEqual({
      removed: ['http-lib', 'socket-lib', 'web-app'],
      retained: ['cli-tool', 'json-lib', 'plugin-a', 'plugin-b'],
    });
  });

  it('reclaims a shared dependency once its last holder is gone', () => {
    expect(autoremove(packages, ['web-app', 'cli-tool'])).toEqual({
      removed: ['cli-tool', 'http-lib', 'json-lib', 'socket-lib', 'web-app'],
      retained: ['plugin-a', 'plugin-b'],
    });
  });

  it('never reclaims a manually installed package', () => {
    const installed: InstalledPackage[] = [
      { name: 'editor', dependsOn: ['syntax-lib'], manuallyInstalled: true },
      { name: 'syntax-lib', dependsOn: [], manuallyInstalled: true },
    ];

    expect(autoremove(installed, ['editor'])).toEqual({
      removed: ['editor'],
      retained: ['syntax-lib'],
    });
  });

  it('ignores a removal name that is not installed', () => {
    expect(autoremove(packages, ['never-installed'])).toEqual({
      removed: [],
      retained: [
        'cli-tool',
        'http-lib',
        'json-lib',
        'plugin-a',
        'plugin-b',
        'socket-lib',
        'web-app',
      ],
    });
  });

  it('does not mutate the input packages', () => {
    const installed: InstalledPackage[] = [
      { name: 'app', dependsOn: ['lib'], manuallyInstalled: true },
      { name: 'lib', dependsOn: [], manuallyInstalled: false },
    ];

    autoremove(installed, ['app']);

    expect(installed).toEqual([
      { name: 'app', dependsOn: ['lib'], manuallyInstalled: true },
      { name: 'lib', dependsOn: [], manuallyInstalled: false },
    ]);
  });

  it('returns an empty plan for no packages', () => {
    expect(autoremove([], [])).toEqual({ removed: [], retained: [] });
  });
});
