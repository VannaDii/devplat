import { describe, expect, it } from 'vitest';

import {
  collectChangedCoverageErrors,
  isExecutableSourceFile,
} from './check-changed-coverage.mjs';

describe('check-changed-coverage', () => {
  const coverageCases = [
    {
      name: 'passes when changed executable files have full coverage',
      inputs: {
        changedFiles: ['packages/openclaw/src/index.ts'],
        coverageText: [
          'TN:',
          'SF:/repo/packages/openclaw/src/index.ts',
          'DA:1,1',
          'DA:2,1',
          'FNDA:1,validatePluginConfig',
          'BRDA:1,0,0,1',
          'end_of_record',
        ].join('\n'),
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
    {
      name: 'fails when changed executable files are missing coverage data',
      inputs: {
        changedFiles: ['packages/openclaw/src/index.ts'],
        coverageText: '',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some((error) =>
            error.includes('packages/openclaw/src/index.ts'),
          ),
        ).toBe(true);
      },
    },
    {
      name: 'fails when changed executable files have partial line coverage',
      inputs: {
        changedFiles: ['packages/openclaw/src/index.ts'],
        coverageText: [
          'TN:',
          'SF:/repo/packages/openclaw/src/index.ts',
          'DA:1,1',
          'DA:2,0',
          'FNDA:1,validatePluginConfig',
          'BRDA:1,0,0,1',
          'end_of_record',
        ].join('\n'),
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(
          errors.some((error) => error.includes('100% line coverage')),
        ).toBe(true);
      },
    },
    {
      name: 'ignores non-executable source files',
      inputs: {
        changedFiles: [
          'packages/openclaw/src/tool-surfaces/types.ts',
          'packages/openclaw/src/tool-surfaces/service.test.ts',
        ],
        coverageText: '',
      },
      mock: async () => undefined,
      assert: (errors) => {
        expect(errors).toEqual([]);
      },
    },
  ];

  it.each(coverageCases)('$name', async (testCase) => {
    await testCase.mock(testCase.inputs);
    const outcome = await collectChangedCoverageErrors({
      rootDirectory: '/repo',
      changedFiles: testCase.inputs.changedFiles,
      coverageText: testCase.inputs.coverageText,
    });
    testCase.assert(outcome);
  });

  const executableCases = [
    {
      name: 'accepts executable source files',
      inputs: { filePath: 'packages/openclaw/src/index.ts' },
      mock: async () => undefined,
      assert: (value) => {
        expect(value).toBe(true);
      },
    },
    {
      name: 'rejects type-only source files',
      inputs: { filePath: 'packages/openclaw/src/tool-surfaces/types.ts' },
      mock: async () => undefined,
      assert: (value) => {
        expect(value).toBe(false);
      },
    },
  ];

  it.each(executableCases)('$name', async (testCase) => {
    await testCase.mock(testCase.inputs);
    const outcome = isExecutableSourceFile(testCase.inputs.filePath);
    testCase.assert(outcome);
  });
});
