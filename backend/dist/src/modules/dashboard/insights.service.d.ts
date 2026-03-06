import { PrismaService } from '../prisma/prisma.service';
export declare class InsightsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAiInsights(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        source: string;
        title: string | null;
        message: string | null;
        payload: import(".prisma/client").Prisma.JsonValue | null;
        status: string;
        occurredAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
