import {
  definePluginEntry,
  type OpenClawPluginConfigSchema,
} from 'openclaw/plugin-sdk/plugin-entry';

import {
  createAllocateWorktreeTool,
  createClaimTaskTool,
  createRunGatesTool,
  createRunSupervisorStepTool,
  createUpdateTaskTool,
  createValidateArtifactTool,
} from './tool-surfaces/service.js';

function validatePluginConfig(value: unknown):
  | {
      ok: true;
      value?: unknown;
    }
  | {
      ok: false;
      errors: string[];
    } {
  if (typeof value !== 'object' || value === null) {
    return {
      ok: false,
      errors: ['Plugin config must be an object.'],
    };
  }

  return {
    ok: true,
    value,
  };
}

const configSchema: OpenClawPluginConfigSchema = {
  validate: validatePluginConfig,
  jsonSchema: {
    type: 'object',
    additionalProperties: false,
  },
};

const devplatOpenClawPlugin = definePluginEntry({
  id: '@vannadii/devplat-openclaw',
  name: 'DevPlat OpenClaw Adapter',
  description:
    'OpenClaw capability bridge for the DevPlat Discord-first platform.',
  configSchema,
  register(api) {
    api.registerTool(createRunGatesTool());
    api.registerTool(createAllocateWorktreeTool());
    api.registerTool(createClaimTaskTool());
    api.registerTool(createUpdateTaskTool());
    api.registerTool(createValidateArtifactTool());
    api.registerTool(createRunSupervisorStepTool());
  },
});

export default devplatOpenClawPlugin;

export * from './plugin-config/index.js';
export * from './tool-surfaces/index.js';
