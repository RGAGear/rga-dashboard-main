import { PrismaService } from '../prisma/prisma.service';
import { CreateUserBehaviorDto } from './dto/create-user-behavior.dto';
import { ListUserBehaviorQuery } from './dto/list-user-behavior.query';
import { CreateAiRecommendationDto } from './dto/create-ai-recommendation.dto';
import { ListAiRecommendationsQuery } from './dto/list-ai-recommendations.query';
export declare class AiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUserBehavior(tenantId: string, userId: string, dto: CreateUserBehaviorDto): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        action: string;
        data: import(".prisma/client").Prisma.JsonValue | null;
        timestamp: Date;
    }>;
    listUserBehavior(tenantId: string, userId: string, query: ListUserBehaviorQuery): Promise<{
        items: {
            id: string;
            tenantId: string;
            userId: string;
            action: string;
            data: import(".prisma/client").Prisma.JsonValue | null;
            timestamp: Date;
        }[];
        nextCursor: string;
    }>;
    createAiRecommendation(tenantId: string, dto: CreateAiRecommendationDto): Promise<{
        id: string;
        tenantId: string;
        type: string;
        title: string;
        description: string;
        priority: string;
        confidence: import("@prisma/client/runtime/library").Decimal;
        status: string;
        payload: import(".prisma/client").Prisma.JsonValue | null;
        executedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listAiRecommendations(tenantId: string, query: ListAiRecommendationsQuery): Promise<{
        items: {
            id: string;
            tenantId: string;
            type: string;
            title: string;
            description: string;
            priority: string;
            confidence: import("@prisma/client/runtime/library").Decimal;
            status: string;
            payload: import(".prisma/client").Prisma.JsonValue | null;
            executedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextCursor: string;
    }>;
}
