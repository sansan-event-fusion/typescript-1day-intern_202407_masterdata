import * as _ from 'lodash';
import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { DataSources } from 'src/value/data-source';

/**
 * 修正データがあったとき、項目単位で優先する
 */
export const SelectModificationStep: MergeWorkflowStep = (data) => {
  const attributesGroupBySLC = _.groupBy(data.in.attributes, (attribute) =>
    [attribute.sansan_location_code, attribute.attribute].join(':'),
  );

  // SLC単位で、修正データがあればそのデータのみに絞り込む
  const attributes = Object.values(attributesGroupBySLC)
    .map((attributes) => {
      const modificationAttributes = attributes.filter(
        (attribute) => attribute.data_source === DataSources.MODIFICATION,
      );
      return modificationAttributes.length > 0
        ? modificationAttributes
        : attributes;
    })
    .flat();

  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
