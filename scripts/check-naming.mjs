import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

import { getRegisteredOpenClawTools } from './check-instructions.mjs';

const execFileAsync = promisify(execFile);
const defaultRootDirectory = resolve(import.meta.dirname, '..');
const RESERVED_TOOL_NAMES = ['codex'];
const CONVENTIONAL_COMMIT_TITLE_PATTERN =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([^)]+\))?!?: .+/u;

export async function collectNamingErrors({
  branchName,
  prTitle,
  rootDirectory = defaultRootDirectory,
  toolNames,
} = {}) {
  const errors = [];
  const resolvedBranchName = await resolveBranchName({
    branchName,
    rootDirectory,
  });
  const resolvedPullRequestTitle = await resolvePullRequestTitle({ prTitle });
  const resolvedToolNames = await resolveToolNames({
    rootDirectory,
    toolNames,
  });

  if (resolvedBranchName.length > 0) {
    const matchingToolName = findMatchingToolName({
      subject: resolvedBranchName,
      toolNames: resolvedToolNames,
    });
    if (matchingToolName !== null) {
      errors.push(
        `Branch name '${resolvedBranchName}' may not include tool name '${matchingToolName}'.`,
      );
    }
  }

  if (resolvedPullRequestTitle.length > 0) {
    if (!CONVENTIONAL_COMMIT_TITLE_PATTERN.test(resolvedPullRequestTitle)) {
      errors.push(
        `Pull request title '${resolvedPullRequestTitle}' must be a conventional commit message.`,
      );
    }

    const matchingToolName = findMatchingToolName({
      subject: resolvedPullRequestTitle,
      toolNames: resolvedToolNames,
    });
    if (matchingToolName !== null) {
      errors.push(
        `Pull request title '${resolvedPullRequestTitle}' may not include tool name '${matchingToolName}'.`,
      );
    }
  }

  return errors;
}

async function resolveToolNames({ rootDirectory, toolNames }) {
  if (Array.isArray(toolNames)) {
    return [...new Set([...toolNames, ...RESERVED_TOOL_NAMES])];
  }

  return [
    ...new Set([
      ...(await getRegisteredOpenClawTools(rootDirectory)),
      ...RESERVED_TOOL_NAMES,
    ]),
  ];
}

async function resolveBranchName({ branchName, rootDirectory }) {
  if (typeof branchName === 'string') {
    return branchName.trim();
  }

  if (typeof process.env.BRANCH_NAME === 'string') {
    return process.env.BRANCH_NAME.trim();
  }

  try {
    const { stdout } = await execFileAsync(
      'git',
      ['branch', '--show-current'],
      { cwd: rootDirectory },
    );
    return stdout.trim();
  } catch {
    return '';
  }
}

async function resolvePullRequestTitle({ prTitle }) {
  if (typeof prTitle === 'string') {
    return prTitle.trim();
  }

  if (typeof process.env.PR_TITLE === 'string') {
    return process.env.PR_TITLE.trim();
  }

  if (typeof process.env.GITHUB_EVENT_PATH !== 'string') {
    return '';
  }

  try {
    const eventPayload = JSON.parse(
      await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'),
    );
    return String(eventPayload.pull_request?.title ?? '').trim();
  } catch {
    return '';
  }
}

function findMatchingToolName({ subject, toolNames }) {
  const subjectTokens = tokenize(subject);
  if (subjectTokens.length === 0) {
    return null;
  }

  for (const toolName of toolNames) {
    const toolTokens = tokenize(toolName);
    if (
      toolTokens.length > 0 &&
      containsTokenSequence(subjectTokens, toolTokens)
    ) {
      return toolName;
    }
  }

  return null;
}

function tokenize(value) {
  return value.toLowerCase().match(/[a-z0-9]+/gu) ?? [];
}

function containsTokenSequence(subjectTokens, candidateTokens) {
  if (candidateTokens.length > subjectTokens.length) {
    return false;
  }

  for (
    let start = 0;
    start <= subjectTokens.length - candidateTokens.length;
    start += 1
  ) {
    let matches = true;
    for (let offset = 0; offset < candidateTokens.length; offset += 1) {
      if (subjectTokens[start + offset] !== candidateTokens[offset]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return true;
    }
  }

  return false;
}

async function main() {
  const errors = await collectNamingErrors();

  if (errors.length > 0) {
    throw new Error(`Naming violations detected:\n${errors.join('\n')}`);
  }

  console.log('Validated branch and pull request naming rules.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
