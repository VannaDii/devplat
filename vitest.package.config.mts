import { relative } from 'node:path';

import { defineConfig } from 'vitest/config';

const repositoryRoot = import.meta.dirname;
const packageDirectory = relative(repositoryRoot, process.cwd()).replaceAll(
  '\\',
  '/',
);
const includePattern =
  packageDirectory.length > 0
    ? `${packageDirectory}/src/**/*.test.ts`
    : 'src/**/*.test.ts';

export default defineConfig({
  root: repositoryRoot,
  test: {
    environment: 'node',
    include: [includePattern],
  },
});
