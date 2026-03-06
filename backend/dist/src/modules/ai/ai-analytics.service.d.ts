import { PrismaService } from '../prisma/prisma.service';
export declare class AiAnalyticsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    collectUserBehavior(tenantId: string, userId: string, action: string, data: any): Promise<void>;
    trackBusinessMetrics(tenantId: string, metrics: any): Promise<void>;
    generateInsights(tenantId: string, type: string): Promise<{
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
    }>;
    getAnalyticsDashboard(tenantId: string, period?: string): Promise<{
        userBehavior: {
            totalSessions: number;
            averageSessionDuration: number;
            topActions: any[];
            uniqueUsers: number;
        };
        businessMetrics: {
            totalRevenue: number;
            conversionRate: number;
            campaignPerformance: any[];
            customerSegments: any[];
        };
        aiInsights: {
            totalInsights: number;
            activeInsights: number;
            insightsByType: {};
            recentInsights: any[];
        };
        period: string;
        generatedAt: Date;
    }>;
    processDailyAnalytics(): Promise<void>;
    private getUserBehaviorStats;
    private getBusinessMetricsStats;
    private getAiInsightsStats;
    private generateDailyInsights;
    private aggregateDailyMetrics;
}
