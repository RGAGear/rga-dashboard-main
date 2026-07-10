import { Controller, Get, Param, Logger } from '@nestjs/common';
import { GoogleAdsApiService } from './services/google-ads-api.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { normalizeEnvValue, resolveGoogleOAuthRedirectUri } from '../../../common/utils/google-oauth.util';

@Controller('debug-ads')
export class GoogleAdsDebugController {
  private readonly logger = new Logger(GoogleAdsDebugController.name);

  constructor(
    private readonly apiService: GoogleAdsApiService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  

  /**
   * 🔎 ระบบวินิจฉัยพิเศษ: เข้าได้โดยไม่ต้อง Login และไม่ต้องมี /api/v1
   * เรียกใช้: https://[โดเมน]/debug-ads/verify/:customerId
   */
  @Get('verify/:customerId')
  async verifyApi(@Param('customerId') customerId: string) {
    const cleanId = customerId.replace(/-/g, '');
    this.logger.log(`[Diagnostic-ROOT] Verifying API for customer ${cleanId}`);
    
    // ค้นหาบัญชีแบบ Global (ไม่เช็ค Tenant เพื่อการวินิจฉัย)
    const account = await this.prisma.googleAdsAccount.findFirst({
        where: { customerId: cleanId }
    });

    if (!account) return { error: `Account ${cleanId} NOT FOUND in your Database!` };

    try {
        const results = await this.apiService.fetchCampaigns(account);
        return {
            success: true,
            accountInDb: { id: account.id, name: account.accountName, loginCustomerId: account.loginCustomerId },
            campaignCount: results.length,
            campaigns: results.map(c => ({ id: c.campaign.id, name: c.campaign.name, status: c.campaign.status }))
        };
    } catch (e) {
        return {
            success: false,
            error: e.message,
            stack: e.stack
        };
    }
  }

  /**
   * Dev-only: show masked Google OAuth config (client IDs, redirect URI)
   * Use this to verify that runtime env matches your Google Cloud credentials.
   */
  @Get('config')
  async debugConfig() {
    const env = process.env.NODE_ENV || 'development';
    const adsClientId = normalizeEnvValue(this.configService.get<string>('GOOGLE_ADS_CLIENT_ID')) || null;
    const adsClientSecret = normalizeEnvValue(this.configService.get<string>('GOOGLE_ADS_CLIENT_SECRET')) || null;
    const clientId = normalizeEnvValue(this.configService.get<string>('GOOGLE_CLIENT_ID')) || null;
    const clientSecret = normalizeEnvValue(this.configService.get<string>('GOOGLE_CLIENT_SECRET')) || null;

    const redirectUri = resolveGoogleOAuthRedirectUri(this.configService, 'GOOGLE_REDIRECT_URI_ADS', '/auth/google/ads/callback');

    const mask = (v: string | null) => {
      if (!v) return null;
      if (v.length <= 8) return '****';
      return `${v.slice(0, 4)}...${v.slice(-4)}`;
    };

    // Only expose detailed info in non-production environments
    if (env === 'production') {
      return { ok: false, error: 'Not available in production' };
    }

    return {
      ok: true,
      nodeEnv: env,
      adsClientIdMasked: mask(adsClientId),
      adsClientSecretPresent: !!adsClientSecret,
      clientIdMasked: mask(clientId),
      clientSecretPresent: !!clientSecret,
      redirectUri,
    };
  }

  // Alternative unambiguous route to fetch runtime OAuth values
  @Get('runtime-config')
  async debugRuntimeConfig() {
    const env = process.env.NODE_ENV || 'development';
    const adsClientId = normalizeEnvValue(this.configService.get<string>('GOOGLE_ADS_CLIENT_ID')) || null;
    const adsClientSecret = normalizeEnvValue(this.configService.get<string>('GOOGLE_ADS_CLIENT_SECRET')) || null;
    const clientId = normalizeEnvValue(this.configService.get<string>('GOOGLE_CLIENT_ID')) || null;
    const clientSecret = normalizeEnvValue(this.configService.get<string>('GOOGLE_CLIENT_SECRET')) || null;

    const redirectUri = resolveGoogleOAuthRedirectUri(this.configService, 'GOOGLE_REDIRECT_URI_ADS', '/auth/google/ads/callback');

    const mask = (v: string | null) => {
      if (!v) return null;
      if (v.length <= 8) return '****';
      return `${v.slice(0, 4)}...${v.slice(-4)}`;
    };

    if (env === 'production') {
      return { ok: false, error: 'Not available in production' };
    }

    return {
      ok: true,
      nodeEnv: env,
      adsClientIdMasked: mask(adsClientId),
      adsClientSecretPresent: !!adsClientSecret,
      clientIdMasked: mask(clientId),
      clientSecretPresent: !!clientSecret,
      redirectUri,
    };
  }
}
