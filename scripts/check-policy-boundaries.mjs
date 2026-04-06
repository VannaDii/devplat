import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const defaultRootDirectory = resolve(import.meta.dirname, '..');

export async function collectPolicyBoundaryErrors({
  rootDirectory = defaultRootDirectory,
} = {}) {
  const errors = [];
  const packagesDirectory = resolve(rootDirectory, 'packages');
  const storageSourceDirectory = resolve(packagesDirectory, 'storage', 'src');
  const openClawSourceDirectory = resolve(packagesDirectory, 'openclaw', 'src');
  const discordSourceDirectory = resolve(packagesDirectory, 'discord', 'src');
  const decoratorAllowedDirectories = [
    discordSourceDirectory,
    openClawSourceDirectory,
  ];
  const adapterImportRules = new Map([
    [
      '@vannadii/devplat-openclaw',
      {
        allowedDirectories: [openClawSourceDirectory],
      },
    ],
    [
      '@vannadii/devplat-discord',
      {
        allowedDirectories: [discordSourceDirectory, openClawSourceDirectory],
      },
    ],
  ]);
  const adapterDependencyRules = new Map([
    [
      '@vannadii/devplat-openclaw',
      {
        allowedPackages: new Set(['openclaw']),
      },
    ],
    [
      '@vannadii/devplat-discord',
      {
        allowedPackages: new Set(['discord', 'openclaw']),
      },
    ],
  ]);

  const packageDirectories = await readdir(packagesDirectory, {
    withFileTypes: true,
  });

  for (const packageDirectory of packageDirectories) {
    if (!packageDirectory.isDirectory()) {
      continue;
    }

    const packageJsonPath = resolve(
      packagesDirectory,
      packageDirectory.name,
      'package.json',
    );
    await validateAdapterDependencies({
      adapterDependencyRules,
      errors,
      packageJsonPath,
      packageName: packageDirectory.name,
      rootDirectory,
    }).catch(() => undefined);

    const sourceDirectory = resolve(
      packagesDirectory,
      packageDirectory.name,
      'src',
    );
    const filePaths = await collectTypeScriptFiles(sourceDirectory).catch(
      () => [],
    );
    for (const filePath of filePaths) {
      if (filePath.endsWith('.test.ts')) {
        continue;
      }

      const sourceText = await readFile(filePath, 'utf8');
      const sourceFile = ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      );

      walkSourceFile(sourceFile, (node) => {
        if (
          ts.isStringLiteralLike(node) &&
          node.text.includes('.devplat') &&
          !isWithinDirectory(filePath, storageSourceDirectory)
        ) {
          const location = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          );
          errors.push(
            `${relative(rootDirectory, filePath)}:${location.line + 1}:${location.character + 1} may not access .devplat outside packages/storage/src.`,
          );
        }

        const moduleSpecifier = getModuleSpecifier(node);
        if (moduleSpecifier !== null) {
          const rule = adapterImportRules.get(moduleSpecifier);
          if (
            rule !== undefined &&
            !rule.allowedDirectories.some((directory) =>
              isWithinDirectory(filePath, directory),
            )
          ) {
            const location = sourceFile.getLineAndCharacterOfPosition(
              node.getStart(sourceFile),
            );
            errors.push(
              `${relative(rootDirectory, filePath)}:${location.line + 1}:${location.character + 1} may not import adapter package '${moduleSpecifier}' outside approved adapter source directories.`,
            );
          }
        }

        if (
          hasDecorators(node) &&
          !decoratorsAllowed(filePath, decoratorAllowedDirectories)
        ) {
          const location = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          );
          errors.push(
            `${relative(rootDirectory, filePath)}:${location.line + 1}:${location.character + 1} uses decorators outside approved OpenClaw or Discord source directories.`,
          );
        }
      });
    }
  }

  return errors;
}

async function collectTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const filePaths = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      filePaths.push(...(await collectTypeScriptFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      filePaths.push(entryPath);
    }
  }

  return filePaths;
}

async function validateAdapterDependencies({
  adapterDependencyRules,
  errors,
  packageJsonPath,
  packageName,
  rootDirectory,
}) {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const dependencySections = [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ];

  for (const sectionName of dependencySections) {
    const dependencies = packageJson[sectionName];
    if (dependencies === null || typeof dependencies !== 'object') {
      continue;
    }

    for (const dependencyName of Object.keys(dependencies)) {
      const rule = adapterDependencyRules.get(dependencyName);
      if (rule !== undefined && !rule.allowedPackages.has(packageName)) {
        errors.push(
          `${relative(rootDirectory, packageJsonPath)} may not declare adapter dependency '${dependencyName}' outside approved adapter packages.`,
        );
      }
    }
  }
}

function walkSourceFile(sourceFile, visitor) {
  function visit(node) {
    visitor(node);
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function getModuleSpecifier(node) {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier !== undefined &&
    ts.isStringLiteralLike(node.moduleSpecifier)
  ) {
    return node.moduleSpecifier.text;
  }

  return null;
}

function decoratorsAllowed(filePath, allowedDirectories) {
  return allowedDirectories.some((directory) =>
    isWithinDirectory(filePath, directory),
  );
}

function isWithinDirectory(filePath, directory) {
  return filePath === directory || filePath.startsWith(`${directory}${sep}`);
}

function hasDecorators(node) {
  if (!ts.canHaveDecorators(node)) {
    return false;
  }

  return (ts.getDecorators(node)?.length ?? 0) > 0;
}

async function main() {
  const errors = await collectPolicyBoundaryErrors();

  if (errors.length > 0) {
    throw new Error(
      `Policy boundary violations detected:\n${errors.join('\n')}`,
    );
  }

  console.log(
    'Validated static policy boundaries for repository source files.',
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
