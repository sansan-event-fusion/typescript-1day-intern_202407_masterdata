import * as _ from 'lodash';
import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { BusinessLocationAttribute } from 'src/value/business-location-attribute';

/**
 * 最新のデータを選択する
 */
export const SelectLatestStep: MergeWorkflowStep = (data) => {
  // 適切な集約の単位にグループを作成する
  const attributeGroupBySLC = _.groupBy(
    data.in.attributes,
    (attribute: BusinessLocationAttribute) => {
      attribute.sansan_location_code + attribute.attribute;
    }, // グループ化のキーを指定する
  );

  // 分割したグループ単位で、最新のデータを選択する
  const attributes = Object.values(attributeGroupBySLC)
    .map(
      (attributes) => {
        return _.maxBy(attributes, (item) => {
          return item.crawled_at;
        });
      }, // lodashの_maxByメソッドを使う
    )
    .flat();

  // TODO: ↓のコードは削除する
  // const attributes = [];

  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
