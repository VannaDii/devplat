import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  definePluginEntry,
  type OpenClawPluginConfigSchema,
} from 'openclaw/plugin-sdk/plugin-entry';

import { decodeWithCodec } from '@vannadii/devplat-core';

import {
  OpenClawPluginConfigCodec,
  PluginConfigService,
} from './plugin-config/index.js';
import {
  createAllocateWorktreeTool,
  createArtifactEnvelopeTool,
  createBindDiscordThreadTool,
  createClaimTaskTool,
  createExecuteCommandTool,
  createEvaluatePolicyActionTool,
  createEvaluateSonarQualityGateTool,
  createRemediationPlanTool,
  createRememberMemoryEntryTool,
  createRecordTelemetryEventTool,
  createReadStoredRecordTool,
  createReviewFindingTool,
  createHandleDiscordApprovalTool,
  createHandleDiscordControlTool,
  createListStoredRecordsTool,
  createOpenDiscordThreadTool,
  createResolveRuntimeConfigTool,
  createResearchBriefTool,
  createRunGatesTool,
  createRunSupervisorStepTool,
  createPlanRebaseDependentsTool,
  createSlicePlanTool,
  createSpecRecordTool,
  createSubmitGitHubActionTool,
  createSubmitPullRequestUpdateTool,
  createUpdateTaskTool,
  createValidateArtifactTool,
} from './tool-surfaces/service.js';

function readSchema(fileName: string): Record<string, unknown> {
  const filePath = resolve(import.meta.dirname, '..', 'schemas', fileName);
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Schema ${fileName} must contain a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

function validatePluginConfig(value: unknown):
  | {
      ok: true;
      value?: unknown;
    }
  | {
      ok: false;
      errors: string[];
    } {
  const decoded = decodeWithCodec(OpenClawPluginConfigCodec, value);
  if (!decoded.ok) {
    return {
      ok: false,
      errors: [decoded.error],
    };
  }

  return {
    ok: true,
    value: new PluginConfigService().execute(decoded.value),
  };
}

const configSchema: OpenClawPluginConfigSchema = {
  validate: validatePluginConfig,
  jsonSchema: readSchema('plugin-config.schema.json'),
};

const devplatOpenClawPlugin = definePluginEntry({
  id: '@vannadii/devplat-openclaw',
  name: 'DevPlat OpenClaw Adapter',
  description:
    'OpenClaw capability bridge for the DevPlat Discord-first platform.',
  configSchema,
  register(api) {
    api.registerTool(createResearchBriefTool());
    api.registerTool(createSpecRecordTool());
    api.registerTool(createSlicePlanTool());
    api.registerTool(createResolveRuntimeConfigTool());
    api.registerTool(createArtifactEnvelopeTool());
    api.registerTool(createExecuteCommandTool());
    api.registerTool(createRunGatesTool());
    api.registerTool(createAllocateWorktreeTool());
    api.registerTool(createBindDiscordThreadTool());
    api.registerTool(createOpenDiscordThreadTool());
    api.registerTool(createHandleDiscordApprovalTool());
    api.registerTool(createHandleDiscordControlTool());
    api.registerTool(createEvaluateSonarQualityGateTool());
    api.registerTool(createReviewFindingTool());
    api.registerTool(createRemediationPlanTool());
    api.registerTool(createRememberMemoryEntryTool());
    api.registerTool(createEvaluatePolicyActionTool());
    api.registerTool(createRecordTelemetryEventTool());
    api.registerTool(createClaimTaskTool());
    api.registerTool(createUpdateTaskTool());
    api.registerTool(createReadStoredRecordTool());
    api.registerTool(createListStoredRecordsTool());
    api.registerTool(createSubmitPullRequestUpdateTool());
    api.registerTool(createPlanRebaseDependentsTool());
    api.registerTool(createSubmitGitHubActionTool());
    api.registerTool(createValidateArtifactTool());
    api.registerTool(createRunSupervisorStepTool());
  },
});

export default devplatOpenClawPlugin;

export * from './plugin-config/index.js';
export * from './tool-surfaces/index.js';
