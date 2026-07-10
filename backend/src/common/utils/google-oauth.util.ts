import { ConfigService } from '@nestjs/config';

/**
 * Resolve Google OAuth redirect URI.
 * Prefers explicit env var; falls back to FRONTEND_URL + callback path.
 */
export function normalizeEnvValue(value: string | undefined): string {
    if (!value) return '';
    return value.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');
}

export function resolveGoogleOAuthRedirectUri(
    configService: ConfigService,
    envKey: string,
    callbackPath: string,
): string {
    const explicit = normalizeEnvValue(configService.get<string>(envKey));
    if (explicit) {
        return explicit;
    }

    const frontendUrl = normalizeEnvValue(
        configService.get<string>('FRONTEND_URL') || 'http://localhost:5173',
    );

    return `${frontendUrl}${callbackPath}`;
}
