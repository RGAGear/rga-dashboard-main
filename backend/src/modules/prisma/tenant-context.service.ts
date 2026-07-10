import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId?: string;
  tenantSlug?: string;
  databaseUrl?: string;
  directUrl?: string;
}

@Injectable()
export class TenantContextService {
  private readonly storage = new AsyncLocalStorage<TenantContext | undefined>();

  runWithContext<T>(context: TenantContext | undefined, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  getCurrentContext(): TenantContext | undefined {
    return this.storage.getStore();
  }
}
