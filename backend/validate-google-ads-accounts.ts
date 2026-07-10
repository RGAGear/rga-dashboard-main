import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/modules/prisma/prisma.service';
import { EncryptionService } from './src/common/services/encryption.service';
import { GoogleAdsClientService } from './src/modules/integrations/google-ads/services/google-ads-client.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const encryptionService = app.get(EncryptionService);
  const clientService = app.get(GoogleAdsClientService);

  console.log('🔎 Validating Google Ads accounts (up to 50)');

  const accounts = await prisma.googleAdsAccount.findMany({
    take: 50,
    include: { tenant: { select: { id: true, users: { select: { email: true } } } } }
  });

  if (!accounts || accounts.length === 0) {
    console.log('No Google Ads accounts found in DB.');
    await app.close();
    return;
  }

  for (const acc of accounts) {
    const emails = acc.tenant?.users?.map((u: any) => u.email).join(', ') || 'N/A';
    const hasRefresh = !!acc.refreshToken;
    const refreshLength = acc.refreshToken ? acc.refreshToken.length : 0;
    console.log('--------------------------------------------------');
    console.log(`Tenant ID: ${acc.tenantId} | Users: ${emails}`);
    console.log(`Customer ID: ${acc.customerId} | Login Customer ID: ${acc.loginCustomerId || 'N/A'}`);
    console.log(`Has refresh token: ${hasRefresh} | Stored length: ${refreshLength}`);

    if (!hasRefresh) {
      console.log('  → No refresh token for this account. User must re-authenticate via OAuth.');
      continue;
    }

    let decrypted = null;
    try {
      decrypted = encryptionService.decrypt(acc.refreshToken);
    } catch (e: any) {
      console.log(`  ❌ Failed to decrypt refresh token: ${e.message}`);
      continue;
    }

    try {
      const access = await clientService.getAccessToken(decrypted);
      if (access) {
        console.log('  ✅ Token refresh succeeded. Access token length:', access.length);
      } else {
        console.log('  ⚠️ Token refresh returned no token.');
      }
    } catch (err: any) {
      const msg = err.message || JSON.stringify(err);
      console.log(`  ❌ Failed to refresh token: ${msg}`);
      if (err.response && err.response.data) {
        console.log(`    Response: ${JSON.stringify(err.response.data).substring(0, 400)}`);
      }
      console.log('    Suggest: Reconnect the Google Ads account via the OAuth flow.');
    }
  }

  console.log('✅ Validation complete.');
  await app.close();
}

bootstrap().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
