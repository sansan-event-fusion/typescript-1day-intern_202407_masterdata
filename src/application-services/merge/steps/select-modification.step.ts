import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { DataSources } from 'src/value/data-source';

/**
 * 修正データがあったとき、項目単位で優先する
 */
export const SelectModificationStep: MergeWorkflowStep = (data) => {
  const attributes = [];
  const manualCollections = data.in.attributes.filter(
    (data) => data.data_source == DataSources.MANUAL_COLLECTION,
  );
  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
