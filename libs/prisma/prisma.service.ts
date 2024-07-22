import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async truncate(tableName: Prisma.ModelName) {
    const schemaName = await this.getSchemaName();
    await this.$executeRaw`TRUNCATE "${Prisma.raw(schemaName)}"."${Prisma.raw(
      tableName,
    )}" CASCADE;`;
  }

  private async getSchemaName(): Promise<string> {
    const result = await this.$queryRaw`
      SELECT current_schema()`;

    return result[0]?.current_schema ?? 'public';
  }
}
