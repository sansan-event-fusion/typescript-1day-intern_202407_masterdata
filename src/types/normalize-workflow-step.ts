import { BusinessLocationAttribute } from 'src/value/business-location-attribute';
import { BusinessLocationRawData } from 'src/value/business-location-raw-data';
import { WorkFlowData } from 'src/value/work-flow-data';

export type NormalizeWorkFlowData = WorkFlowData<
  BusinessLocationRawData,
  BusinessLocationAttribute[]
>;

export type NormalizeWorkflowStep = (
  data: NormalizeWorkFlowData,
) => NormalizeWorkFlowData | Promise<NormalizeWorkFlowData>;
