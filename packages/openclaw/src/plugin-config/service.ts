import {
  createOpenClawPluginConfig,
  describeOpenClawPluginConfig,
} from './logic.js';
import type { OpenClawPluginConfig } from './types.js';

export class PluginConfigService {
  public execute(input: OpenClawPluginConfig): OpenClawPluginConfig {
    return createOpenClawPluginConfig(input);
  }

  public explain(input: OpenClawPluginConfig): string {
    return describeOpenClawPluginConfig(input);
  }
}
