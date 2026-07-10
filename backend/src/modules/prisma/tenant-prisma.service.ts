import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { TenantDatabaseResolver } from './tenant-database.resolver';
import { TenantContextService } from './tenant-context.service';

@Injectable()
export class TenantPrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly tenantDatabaseResolver: TenantDatabaseResolver,
    private readonly tenantContextService: TenantContextService,
  ) {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async connectForTenant(tenantId?: string, tenantSlug?: string): Promise<PrismaClient> {
    const tenantDb = this.tenantDatabaseResolver.resolve(tenantId, tenantSlug);

    if (!tenantDb) {
      return this;
    }

    const cleanUrl = tenantDb.databaseUrl.replace('?sslmode=require', '').replace('&sslmode=require', '');

    const pool = new Pool({
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool as any);

    return new PrismaClient({
      adapter,
      log: ['warn', 'error'],
    });
  }

  getTenantContext() {
    return this.tenantContextService.getCurrentContext();
  }
}
