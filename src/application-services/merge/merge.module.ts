import { Module } from '@nestjs/common';
import { WorkflowType } from 'libs/workflow-executor/src/workflow-type';
import { WorkFlowExecutorService } from 'libs/workflow-executor/src/workflow-executor.service';
import { RawDataRepo } from 'src/repository/raw-data.repo';
import { RawDataRepoImpl } from 'src/repository-impl/raw-data.repo-impl';
import { PrismaService } from 'libs/prisma/prisma.service';

@Module({
  providers: [
    {
      provide: RawDataRepo,
      useClass: RawDataRepoImpl,
    },
    {
      provide: WorkflowType.MERGE,
      useFactory: (prismaService: PrismaService) => {
        return new WorkFlowExecutorService(WorkflowType.MERGE, prismaService);
      },
      inject: [PrismaService],
    },
    PrismaService,
  ],
})
export class MergeModule {}
