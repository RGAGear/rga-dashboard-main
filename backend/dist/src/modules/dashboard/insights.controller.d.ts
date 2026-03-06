import { InsightsService } from './insights.service';
export declare class InsightsController {
    private readonly insightsService;
    constructor(insightsService: InsightsService);
    getInsights(tenantId: string): Promise<{
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
