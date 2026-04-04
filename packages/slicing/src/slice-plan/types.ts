export type SliceSize = 'small' | 'medium' | 'large';

export interface SlicePlan {
  sliceId: string;
  specId: string;
  title: string;
  dependsOn: string[];
  acceptanceCriteria: string[];
  doneConditions: string[];
  size: SliceSize;
  updatedAt: string;
}
