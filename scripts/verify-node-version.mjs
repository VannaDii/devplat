import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

import semver from 'semver';

const rootDirectory = resolve(import.meta.dirname, '..');

const packageJson = JSON.parse(
  await readFile(resolve(rootDirectory, 'package.json'), 'utf8'),
);
const expectedNodeVersion = (
  await readFile(resolve(rootDirectory, '.nvmrc'), 'utf8')
).trim();
const actualNodeVersion = process.version;
const actualNpmVersion =
  process.env.npm_config_user_agent?.match(/npm\/(\d+\.\d+\.\d+)/)?.[1] ?? null;
const expectedNodeRange = packageJson.engines.node;
const expectedNpmRange = packageJson.engines.npm;

if (!/^v24\.\d+\.\d+$/.test(expectedNodeVersion)) {
  throw new Error(
    `.nvmrc must contain an exact v24.x.y release. Found '${expectedNodeVersion}'.`,
  );
}

if (actualNodeVersion !== expectedNodeVersion) {
  throw new Error(
    `Active Node ${actualNodeVersion} does not match .nvmrc ${expectedNodeVersion}. Run 'nvm use'.`,
  );
}

if (!semver.satisfies(semver.coerce(actualNodeVersion), expectedNodeRange)) {
  throw new Error(
    `Active Node ${actualNodeVersion} does not satisfy engines.node ${expectedNodeRange}.`,
  );
}

if (!semver.satisfies(semver.coerce(expectedNodeVersion), expectedNodeRange)) {
  throw new Error(
    `.nvmrc ${expectedNodeVersion} is outside engines.node ${expectedNodeRange}.`,
  );
}

if (actualNpmVersion === null) {
  throw new Error(
    'Unable to determine the active npm version from npm_config_user_agent.',
  );
}

if (!semver.satisfies(actualNpmVersion, expectedNpmRange)) {
  throw new Error(
    `Active npm ${actualNpmVersion} does not satisfy engines.npm ${expectedNpmRange}.`,
  );
}

console.log(`Verified Node ${actualNodeVersion} and npm ${actualNpmVersion}.`);
