import type { ResearchBrief } from './types.js';

export function createResearchBrief(input: ResearchBrief): ResearchBrief {
  return {
    ...input,
    topic: input.topic.trim(),
    question: input.question.trim(),
    constraints: [
      ...new Set(
        input.constraints.map((value) => value.trim()).filter(Boolean),
      ),
    ],
    findings: [
      ...new Set(input.findings.map((value) => value.trim()).filter(Boolean)),
    ],
    recommendation: input.recommendation.trim(),
    sourceUrls: [
      ...new Set(input.sourceUrls.map((value) => value.trim()).filter(Boolean)),
    ],
    updatedAt: new Date(input.updatedAt).toISOString(),
  };
}

export function describeResearchBrief(input: ResearchBrief): string {
  return `Research brief -> ${input.topic}`;
}
