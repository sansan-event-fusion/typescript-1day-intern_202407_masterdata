export const WorkflowType = {
  MERGE: 'MergeWorkflow',
  NORMALIZE: 'NormalizeWorkflow',
} as const;

export type WorkflowType = (typeof WorkflowType)[keyof typeof WorkflowType];
