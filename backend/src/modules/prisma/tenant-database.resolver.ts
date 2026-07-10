import { Injectable } from '@nestjs/common';
import { TenantContextService } from './tenant-context.service';

export interface TenantDatabaseConfig {
  databaseUrl: string;
  directUrl?: string;
}

@Injectable()
export class TenantDatabaseResolver {
  constructor(private readonly tenantContextService: TenantContextService) {}

  resolve(tenantId?: string, tenantSlug?: string): TenantDatabaseConfig | null {
    const context = this.tenantContextService.getCurrentContext();
    const activeTenantId = tenantId || context?.tenantId;
    const activeTenantSlug = tenantSlug || context?.tenantSlug;

    if (activeTenantId && process.env[`TENANT_DB_URL_${activeTenantId.toUpperCase()}`]) {
      return {
        databaseUrl: process.env[`TENANT_DB_URL_${activeTenantId.toUpperCase()}`]!,
        directUrl: process.env[`TENANT_DIRECT_URL_${activeTenantId.toUpperCase()}`],
      };
    }

    if (activeTenantSlug && process.env[`TENANT_DB_URL_${activeTenantSlug.toUpperCase()}`]) {
      return {
        databaseUrl: process.env[`TENANT_DB_URL_${activeTenantSlug.toUpperCase()}`]!,
        directUrl: process.env[`TENANT_DIRECT_URL_${activeTenantSlug.toUpperCase()}`],
      };
    }

    return null;
  }
}
