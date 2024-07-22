import { Observable } from 'rxjs';
import { MergeWorkFlowData } from 'src/types/merge-workflow-step';

export abstract class BusinessLocationAttributeRepo {
  abstract fetch(): Promise<Observable<MergeWorkFlowData>>;
}
