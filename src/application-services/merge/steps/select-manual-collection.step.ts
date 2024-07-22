import { MergeWorkflowStep } from 'src/types/merge-workflow-step';
import { DataSources } from 'src/value/data-source';

/**
 * 手収集した拠点情報が存在する場合は「SOC単位で」その拠点情報を優先する
 */
export const SelectManualCollectionStep: MergeWorkflowStep = (data) => {
  // データソースが人力収集のデータに絞り込む
  // TODO: filterメソッド内の処理を書く
  // const manualCollections = data.in.attributes.filter();

  // 人力収集データがない場合は、何もしないでdataをそのまま返す
  // TODO: 処理を書く

  // 人力収集データがある場合は、人力収集データと修正データのみに絞り込む
  // TODO: filterメソッド内の処理を書く
  // const attributes = data.in.attributes.filter();

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
