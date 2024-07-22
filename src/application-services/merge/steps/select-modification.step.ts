import { MergeWorkflowStep } from 'src/types/merge-workflow-step';

/**
 * 修正データがあったとき、項目単位で優先する
 */
export const SelectModificationStep: MergeWorkflowStep = (data) => {
  const attributes = [];
  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
