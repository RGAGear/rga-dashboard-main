"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolkitAuthService = void 0;
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const client_1 = require("@prisma/client");
const DUMMY_PASSWORD_HASH = '$2b$10$DUMMYHASH.toolkit.placeholder.password.hash';
const TOOLKIT_USER_EMAIL_PREFIX = 'toolkit-admin';
class ToolkitAuthService {
    constructor(prisma) {
        this.prisma = prisma || new client_1.PrismaClient();
    }
    async getOrCreateAdmin(tenantId) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                tenantId: tenantId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        if (existingUser) {
            return {
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role,
            };
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new Error(`Tenant not found: ${tenantId}`);
        }
        const newUser = await this.prisma.user.create({
            data: {
                tenantId: tenantId,
                email: `${TOOLKIT_USER_EMAIL_PREFIX}@${tenantId.slice(0, 8)}.local`,
                password: DUMMY_PASSWORD_HASH,
                firstName: 'Toolkit',
                lastName: 'Admin',
                role: client_1.UserRole.ADMIN,
                isActive: true,
                emailVerified: true,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        return {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
    }
    generateImpersonationToken(user, _tenantId) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Missing JWT_SECRET in environment. Check .env file.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
        };
        return jwt.sign(payload, secret, {
            expiresIn: '5m',
        });
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
exports.ToolkitAuthService = ToolkitAuthService;
//# sourceMappingURL=toolkit-auth.service.js.map