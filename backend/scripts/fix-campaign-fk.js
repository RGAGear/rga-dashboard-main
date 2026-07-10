const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();

  try {
    const checks = [
      { column: 'google_ads_account_id', table: 'google_ads_accounts' },
      { column: 'facebook_ads_account_id', table: 'facebook_ads_accounts' },
      { column: 'tiktok_ads_account_id', table: 'tiktok_ads_accounts' },
      { column: 'line_ads_account_id', table: 'line_ads_accounts' },
      { column: 'integration_id', table: 'integrations' },
    ];

    for (const { column, table } of checks) {
      const countResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS cnt FROM campaigns WHERE ${column} IS NOT NULL AND ${column} NOT IN (SELECT id FROM ${table})`);
      const count = Number(countResult[0]?.cnt || 0);
      console.log(`[fix-campaign-fk] ${column} -> ${table}: ${count}`);

      if (count > 0) {
        await prisma.$executeRawUnsafe(`UPDATE campaigns SET ${column}=NULL WHERE ${column} IS NOT NULL AND ${column} NOT IN (SELECT id FROM ${table})`);
        console.log(`[fix-campaign-fk] cleared ${count} orphaned ${column} values`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
