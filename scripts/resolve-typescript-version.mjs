import rcompare from 'semver/functions/rcompare.js';

const majorVersion = process.argv[2];
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10_000);

if (!/^\d+$/.test(majorVersion ?? '')) {
  throw new Error('Usage: node scripts/resolve-typescript-version.mjs <major>');
}

let response;

try {
  response = await fetch('https://registry.npmjs.org/typescript', {
    headers: {
      accept: 'application/json',
    },
    signal: controller.signal,
  });
} catch (error) {
  if (error instanceof Error && error.name === 'AbortError') {
    throw new Error('Timed out while resolving TypeScript versions from npm.');
  }

  throw error;
} finally {
  clearTimeout(timeout);
}

if (!response.ok) {
  throw new Error(
    `Failed to resolve TypeScript versions from npm registry: ${response.status} ${response.statusText}`,
  );
}

const payload = await response.json();
const versions = Object.keys(payload.versions ?? {});

if (!Array.isArray(versions)) {
  throw new Error(
    'npm registry returned an invalid TypeScript versions payload',
  );
}

const resolvedVersion = versions
  .filter(
    (version) =>
      typeof version === 'string' &&
      version.startsWith(`${majorVersion}.`) &&
      !version.includes('-'),
  )
  .sort(rcompare)
  .at(0);

if (typeof resolvedVersion !== 'string') {
  throw new Error(
    `Could not resolve a stable TypeScript ${majorVersion}.x version.`,
  );
}

process.stdout.write(`${resolvedVersion}\n`);
