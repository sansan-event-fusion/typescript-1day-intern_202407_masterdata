import { BusinessLocationAttributesGroupBySOC } from 'src/value/business-location-attribute-group';
import { BusinessLocation } from 'src/value/business-location';
import { WorkFlowData } from 'src/value/work-flow-data';

export type MergeWorkFlowData = WorkFlowData<
  BusinessLocationAttributesGroupBySOC,
  BusinessLocation[]
>;

export type MergeWorkflowStep = (data: MergeWorkFlowData) => MergeWorkFlowData;
