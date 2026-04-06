import { describe, expect, it } from 'vitest';

import { collectNamingErrors } from './check-naming.mjs';

describe('check-naming', () => {
  it('passes for safe branch and pull request names', async () => {
    await expect(
      collectNamingErrors({
        branchName: 'chore/instruction-governance',
        prTitle: 'chore: tighten platform instruction governance',
      }),
    ).resolves.toEqual([]);
  });

  it('fails when a branch name includes a tool name variant', async () => {
    const errors = await collectNamingErrors({
      branchName: 'chore/run-gates-policy',
      prTitle: 'chore: tighten policy enforcement',
    });

    expect(
      errors.some(
        (error) =>
          error.includes("Branch name 'chore/run-gates-policy'") &&
          error.includes("'run_gates'"),
      ),
    ).toBe(true);
  });

  it('fails when a pull request title includes a spaced tool name variant', async () => {
    const errors = await collectNamingErrors({
      branchName: 'chore/instruction-governance',
      prTitle: 'chore: refine handle discord control behavior',
    });

    expect(
      errors.some(
        (error) =>
          error.includes(
            "Pull request title 'chore: refine handle discord control behavior'",
          ) && error.includes("'handle_discord_control'"),
      ),
    ).toBe(true);
  });

  it('fails when a pull request title is not a conventional commit message', async () => {
    const errors = await collectNamingErrors({
      branchName: 'chore/instruction-governance',
      prTitle: 'Tighten platform instruction governance',
    });

    expect(
      errors.some(
        (error) =>
          error.includes(
            "Pull request title 'Tighten platform instruction governance'",
          ) && error.includes('conventional commit message'),
      ),
    ).toBe(true);
  });
});
