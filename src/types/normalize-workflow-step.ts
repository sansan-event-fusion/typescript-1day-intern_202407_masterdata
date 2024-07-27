import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import { BusinessLocationRawData } from 'src/value/business-location-raw-data';
import { WorkFlowData } from 'src/value/work-flow-data';

export type NormalizeWorkFlowData = WorkFlowData<
  BusinessLocationRawData,//in
  BusinessLocationAttribute[]//out
>;
//入力と同じ型を返す関数
export type NormalizeWorkflowStep = (
  data: NormalizeWorkFlowData,//引数
) => NormalizeWorkFlowData | Promise<NormalizeWorkFlowData>;
