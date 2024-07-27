import * as _ from 'lodash';
import { MergeWorkflowStep } from 'src/types/merge-workflow-step';

/**
 * 最新のデータを選択する
 */
export const SelectLatestStep: MergeWorkflowStep = (data) => {
  // 適切な集約の単位にグループを作成する
  //SLCとattributeでのグループ
  const attributeGroupBySLC = _.groupBy(data.in.attributes, (attribute) =>
    [attribute.sansan_location_code, attribute.attribute].join(':'),
  );

  // 分割したグループ単位で、最新のデータを選択する
  const attributes = Object.values(attributeGroupBySLC)
    .map((attributes) =>
      // lodashの_maxByメソッドを使う
      _.maxBy(attributes, (attribute) => attribute.crawled_at),
    )
    .flat();

  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
