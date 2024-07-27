import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RawDataRepo } from './repository/raw-data.repo';
import { WorkflowType } from 'libs/workflow-executor/src/workflow-type';
import { BusinessLocationAttributeRepo } from './repository/business-location-attribute.repo';
import { WorkFlowExecutorService } from 'libs/workflow-executor/src/workflow-executor.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 正規化ワークフロー
  // console.time('normalizeWorkflow');
  // const rawRepo = app.get(RawDataRepo);
  // const rawDataObservable = await rawRepo.fetch();
  // const normalizeExecutor = app.get<WorkFlowExecutorService>(
  //   WorkflowType.NORMALIZE,
  // );
  // await normalizeExecutor.execute(rawDataObservable);
  // console.timeEnd('normalizeWorkflow');

  // 名寄せ・統合ワークフロー
  console.time('mergeWorkflow');
  const attributeRepo = app.get(BusinessLocationAttributeRepo);
  const attributeGroup = await attributeRepo.fetch();
  const mergeExecutor = app.get<WorkFlowExecutorService>(WorkflowType.MERGE);
  await mergeExecutor.execute(attributeGroup);
  console.timeEnd('mergeWorkflow');
}
bootstrap();
