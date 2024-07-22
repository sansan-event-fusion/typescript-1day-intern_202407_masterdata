import * as _ from 'lodash';
import { MergeWorkflowStep } from 'src/types/merge-workflow-step';

/**
 * 最新のデータを選択する
 */
export const SelectLatestStep: MergeWorkflowStep = (data) => {
  // 適切な集約の単位にグループを作成する
  // const attributeGroupBySLC = _.groupBy(
  //   data.in.attributes,
  //   (attribute) => // グループ化のキーを指定する
  // );

  // 分割したグループ単位で、最新のデータを選択する
  // const attributes = Object.values(attributeGroupBySLC)
  //   .map((attributes) =>
  //     // lodashの_maxByメソッドを使う
  //   )
  //   .flat();

  // TODO: ↓のコードは削除する
  const attributes = [];

  return {
    in: {
      ...data.in,
      attributes,
    },
    out: data.out,
  };
};
