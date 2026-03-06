import { AiService } from './ai.service';
import { CreateUserBehaviorDto } from './dto/create-user-behavior.dto';
import { CreateAiRecommendationDto } from './dto/create-ai-recommendation.dto';
import { ListUserBehaviorQuery } from './dto/list-user-behavior.query';
import { ListAiRecommendationsQuery } from './dto/list-ai-recommendations.query';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    createBehavior(dto: CreateUserBehaviorDto, req: any): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        action: string;
        data: import(".prisma/client").Prisma.JsonValue | null;
        timestamp: Date;
    }>;
    listBehavior(query: ListUserBehaviorQuery, req: any): Promise<{
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
    createRecommendation(dto: CreateAiRecommendationDto, req: any): Promise<{
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
    listRecommendations(query: ListAiRecommendationsQuery, req: any): Promise<{
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
