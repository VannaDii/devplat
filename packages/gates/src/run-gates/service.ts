import {
  createGateRunReport,
  describeGateRunReport,
  runGates,
} from './logic.js';
import type { GateRunReport } from './types.js';

export class RunGatesService {
  public execute(input: GateRunReport): GateRunReport {
    return createGateRunReport(input);
  }

  public explain(input: GateRunReport): string {
    return describeGateRunReport(input);
  }

  public run(gateNames: string[], summary: string): GateRunReport {
    return runGates(gateNames, summary);
  }
}
