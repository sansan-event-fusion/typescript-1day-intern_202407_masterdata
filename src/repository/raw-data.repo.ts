import { Observable } from 'rxjs';
import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';

export abstract class RawDataRepo {
  abstract fetch(): Promise<Observable<NormalizeWorkFlowData>>;
}
