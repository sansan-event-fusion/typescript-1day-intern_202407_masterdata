import { Module } from '@nestjs/common';
import { WorkflowType } from 'libs/workflow-executor/src/workflow-type';
import { WorkFlowExecutorService } from 'libs/workflow-executor/src/workflow-executor.service';
import { BusinessLocationAttributeRepo } from 'src/repository/business-location-attribute.repo';
import { BusinessLocationAttributeRepoImpl } from 'src/repository-impl/business-location-attribute.repo-impl';
import { PrismaService } from 'libs/prisma/prisma.service';

@Module({
  providers: [
    {
      provide: WorkflowType.NORMALIZE,
      useFactory: (prismaService: PrismaService) => {
        return new WorkFlowExecutorService(
          WorkflowType.NORMALIZE,
          prismaService,
        );
      },
      inject: [PrismaService],
    },
    {
      provide: BusinessLocationAttributeRepo,
      useClass: BusinessLocationAttributeRepoImpl,
    },
    PrismaService,
  ],
})
export class NormalizeModule {}
