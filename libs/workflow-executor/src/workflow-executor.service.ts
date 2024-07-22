import { Injectable } from '@nestjs/common';
import { WorkflowType } from './workflow-type';
import { Observable, bufferCount, catchError, concatMap } from 'rxjs';
import { MERGE_WORKFLOW_STEPS } from 'src/application-services/merge/steps/merge-workflow-steps';
import { NORMALIZE_WORKFLOW_STEPS } from 'src/application-services/normalize/steps/normalize-workflow-steps';
import { NormalizeWorkFlowData } from 'src/types/normalize-workflow-step';
import { MergeWorkFlowData } from 'src/types/merge-workflow-step';
import { PrismaService } from 'libs/prisma/prisma.service';
import { Prisma } from '@prisma/client';

// TODO: NormalizeWorkflowの型はPromiseかPromiseなしのどちらかに統一したい
type WorkFlowData =
  | Promise<NormalizeWorkFlowData>
  | NormalizeWorkFlowData
  | MergeWorkFlowData;

type Step<T = WorkFlowData> = (data: T) => T;

@Injectable()
export class WorkFlowExecutorService {
  private readonly steps: Step[];
  private readonly modelName: Prisma.ModelName;
  constructor(
    workflowType: WorkflowType,
    private readonly prisma: PrismaService,
  ) {
    this.steps = this.workflowTypeToSteps(workflowType);
    this.modelName = this.workflowTypeToModelName(workflowType);
  }

  async execute(rawData: Observable<WorkFlowData>) {
    await this.prisma.truncate(this.modelName);

    const model = this.getModel(this.modelName);
    const appliedObservable = this.steps
      .reduce<Observable<WorkFlowData>>((acc, step: Step) => {
        return acc.pipe(concatMap(async (x) => step(x)));
      }, rawData)
      .pipe(
        bufferCount(100),
        concatMap(async (x: (NormalizeWorkFlowData | MergeWorkFlowData)[]) => {
          return x.map((d) => d.out).flat();
        }),
        concatMap(async (data) => {
          await model.createMany({
            data,
          });
          console.log(`${data.length} inserted`);
          return data;
        }),
        catchError((e) => {
          console.error(e);
          throw e;
        }),
      );

    return new Promise<void>((resolve, reject) => {
      appliedObservable.subscribe({
        error(e) {
          console.error(e);
          reject(e);
        },
        complete() {
          console.log('complete');
          resolve();
        },
      });
    });
  }

  // MEMO: 個人的には構造体としてもっていいかもと思うがそれはTSらしくない??（こっちほうがTSチック？）
  private workflowTypeToSteps(workflowType: WorkflowType): Step[] {
    switch (workflowType) {
      case WorkflowType.MERGE:
        return MERGE_WORKFLOW_STEPS;
      case WorkflowType.NORMALIZE:
        return NORMALIZE_WORKFLOW_STEPS;
      // POINT: ここでnever型を使うことで、switch文の網羅性を保証できる
      default:
        throw new Error(workflowType satisfies never);
    }
  }

  private workflowTypeToModelName(workflowType: WorkflowType) {
    switch (workflowType) {
      case WorkflowType.MERGE:
        return 'BusinessLocation';
      case WorkflowType.NORMALIZE:
        return 'BaseAttribute';
      // POINT: ここでnever型を使うことで、switch文の網羅性を保証できる
      default:
        throw new Error(workflowType satisfies never);
    }
  }

  private getModel(modelName: Prisma.ModelName) {
    const referenceName = modelName[0].toLowerCase() + modelName.slice(1);
    return this.prisma[referenceName];
  }
}
