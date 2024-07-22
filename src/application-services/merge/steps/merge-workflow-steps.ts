import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { SelectLatestStep } from './select-latest.step';
import { SelectManualCollectionStep } from './select-manual-collection.step';
import { BuildBusinessLocationStep } from './build-business-location.step';

export const MERGE_WORKFLOW_STEPS: MergeWorkflowStep[] = [
  SelectManualCollectionStep,
  SelectLatestStep,
  BuildBusinessLocationStep,
];
