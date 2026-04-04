export interface ResearchBrief {
  researchId: string;
  topic: string;
  question: string;
  constraints: string[];
  findings: string[];
  recommendation: string;
  sourceUrls: string[];
  updatedAt: string;
}
