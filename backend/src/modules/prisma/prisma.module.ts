import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantContextService } from './tenant-context.service';
import { TenantDatabaseResolver } from './tenant-database.resolver';
import { TenantPrismaService } from './tenant-prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    TenantContextService,
    TenantDatabaseResolver,
    TenantPrismaService,
  ],
  exports: [PrismaService, TenantContextService, TenantDatabaseResolver, TenantPrismaService],
})
export class PrismaModule {}

