export type ReviewSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ReviewFinding {
  findingId: string;
  severity: ReviewSeverity;
  path: string;
  message: string;
  rationale: string;
  fixRecommendation: string;
  blocking: boolean;
  updatedAt: string;
}
