import { describe, expect, it } from 'vitest';

import { collectNamingErrors } from './check-naming.mjs';

describe('check-naming', () => {
  const cases = [
    {
      name: 'passes for safe branch and pull request names',
      inputs: {
        branchName: 'chore/instruction-governance',
        prTitle: 'chore: tighten platform instruction governance',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
    {
      name: 'fails when a branch name includes a tool name variant',
      inputs: {
        branchName: 'chore/run-gates-policy',
        prTitle: 'chore: tighten policy enforcement',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes("Branch name 'chore/run-gates-policy'") &&
              error.includes("'run_gates'"),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when a branch name includes a registered non-foundation tool',
      inputs: {
        branchName: 'chore/execute-command-guardrails',
        prTitle: 'chore: tighten policy enforcement',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes(
                "Branch name 'chore/execute-command-guardrails'",
              ) && error.includes("'execute_command'"),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when a pull request title includes a spaced tool name variant',
      inputs: {
        branchName: 'chore/instruction-governance',
        prTitle: 'chore: refine handle discord control behavior',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes(
                "Pull request title 'chore: refine handle discord control behavior'",
              ) && error.includes("'handle_discord_control'"),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when a pull request title is not a conventional commit message',
      inputs: {
        branchName: 'chore/instruction-governance',
        prTitle: 'Tighten platform instruction governance',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some(
            (error) =>
              error.includes(
                "Pull request title 'Tighten platform instruction governance'",
              ) && error.includes('conventional commit message'),
          ),
        ).toBe(true);
      },
    },
  ];

  it.each(cases)('$name', async (testCase) => {
    await testCase.mock(testCase.inputs);
    const outcome = await collectNamingErrors(testCase.inputs);
    testCase.assert(outcome);
  });
});
