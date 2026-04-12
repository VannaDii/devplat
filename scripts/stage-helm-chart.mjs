import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const rootDirectory = resolve(import.meta.dirname, '..');
const chartSourceDirectory = resolve(rootDirectory, 'deploy/helm/devplat');

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    args.set(argv[index], argv[index + 1]);
  }

  return {
    appVersion: args.get('--app-version'),
    chartVersion: args.get('--chart-version'),
    imageTag: args.get('--image-tag'),
    outDir: args.get('--out-dir'),
  };
}

function replaceOne(sourceText, pattern, replacement, label) {
  if (!pattern.test(sourceText)) {
    throw new Error(`Unable to update ${label}.`);
  }

  return sourceText.replace(pattern, replacement);
}

const { appVersion, chartVersion, imageTag, outDir } = parseArgs(
  process.argv.slice(2),
);
if (!appVersion || !chartVersion || !imageTag || !outDir) {
  throw new Error(
    'Usage: node scripts/stage-helm-chart.mjs --out-dir <dir> --chart-version <version> --app-version <version> --image-tag <tag>',
  );
}

const outputDirectory = resolve(rootDirectory, outDir);
await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(chartSourceDirectory, outputDirectory, { recursive: true });

const chartYamlPath = resolve(outputDirectory, 'Chart.yaml');
const valuesYamlPath = resolve(outputDirectory, 'values.yaml');

const chartYaml = await readFile(chartYamlPath, 'utf8');
const valuesYaml = await readFile(valuesYamlPath, 'utf8');

const updatedChartYaml = replaceOne(
  replaceOne(
    chartYaml,
    /^version:\s.*$/mu,
    `version: ${JSON.stringify(chartVersion)}`,
    'chart version',
  ),
  /^appVersion:\s.*$/mu,
  `appVersion: ${JSON.stringify(appVersion)}`,
  'chart appVersion',
);
const updatedValuesYaml = replaceOne(
  valuesYaml,
  /^ {2}tag:\s.*$/mu,
  `  tag: ${JSON.stringify(imageTag)}`,
  'chart image tag',
);

await writeFile(chartYamlPath, updatedChartYaml, 'utf8');
await writeFile(valuesYamlPath, updatedValuesYaml, 'utf8');

process.stdout.write(
  `${JSON.stringify(
    {
      appVersion,
      chartDirectory: outputDirectory,
      chartVersion,
      imageTag,
    },
    null,
    2,
  )}\n`,
);
