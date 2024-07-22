import { Module } from '@nestjs/common';
import { MergeModule } from './application-services/merge/merge.module';
import { NormalizeModule } from './application-services/normalize/normalize.module';
import { PrismaService } from 'libs/prisma/prisma.service';

@Module({
  imports: [MergeModule, NormalizeModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
