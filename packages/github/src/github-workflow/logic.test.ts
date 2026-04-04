import { describe, expect, it } from 'vitest';

import {
  createGitHubActionRequest,
  describeGitHubActionRequest,
  isPrivilegedGitHubAction,
} from './logic.js';

describe('GitHubActionRequest logic', () => {
  it('normalizes GitHub action requests and privilege inference', () => {
    const snapshot = createGitHubActionRequest({
      repoFullName: ' VannaDii/devplat ',
      action: 'merge-pr',
      summary: '  Merge the approved slice PR  ',
      privileged: false,
      targetNumber: 42,
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.repoFullName).toBe('VannaDii/devplat');
    expect(isPrivilegedGitHubAction(snapshot)).toBe(true);
    expect(describeGitHubActionRequest(snapshot)).toContain('merge-pr');
  });

  it('treats regular update actions as non-privileged by default', () => {
    const snapshot = createGitHubActionRequest({
      repoFullName: ' VannaDii/devplat ',
      action: 'update-pr',
      summary: '  Refresh the PR body  ',
      privileged: false,
      branchName: ' feature/refresh ',
      updatedAt: '2026-04-04T00:00:00.000Z',
    });

    expect(snapshot.branchName).toBe('feature/refresh');
    expect(isPrivilegedGitHubAction(snapshot)).toBe(false);
  });
});
