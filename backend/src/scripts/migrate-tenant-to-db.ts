import * as dotenv from 'dotenv';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

async function main() {
  const tenantId = process.argv[2];
  const tenantSlug = process.argv[3];
  const databaseUrl = process.argv[4];

  if (!tenantId || !databaseUrl) {
    console.error('Usage: ts-node migrate-tenant-to-db.ts <tenantId> <tenantSlug> <databaseUrl>');
    process.exit(1);
  }

  const masterPrisma = new PrismaClient();

  try {
    const tenant = await masterPrisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    console.log(`[migrate-tenant] preparing migration for tenant ${tenant.name} (${tenant.id})`);

    process.env[`TENANT_DB_URL_${tenantId.toUpperCase()}`] = databaseUrl;
    process.env[`TENANT_DIRECT_URL_${tenantId.toUpperCase()}`] = databaseUrl;

    if (tenantSlug) {
      process.env[`TENANT_DB_URL_${tenantSlug.toUpperCase()}`] = databaseUrl;
      process.env[`TENANT_DIRECT_URL_${tenantSlug.toUpperCase()}`] = databaseUrl;
    }

    console.log('[migrate-tenant] tenant database mapping configured');
    console.log('[migrate-tenant] next step: run your tenant data copy script and validate the connection');
  } finally {
    await masterPrisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
