import { AdGroupsService } from './ad-groups.service';
import { CreateAdGroupDto, UpdateAdGroupDto, QueryAdGroupsDto } from './dto';
export declare class AdGroupsController {
    private readonly adGroupsService;
    constructor(adGroupsService: AdGroupsService);
    create(req: any, createAdGroupDto: CreateAdGroupDto): Promise<{
        budget: number;
        bidAmount: number;
        id: string;
        tenantId: string;
        campaignId: string;
        externalId: string | null;
        name: string;
        status: import(".prisma/client").$Enums.AdGroupStatus;
        bidType: string | null;
        targeting: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        campaign?: unknown;
    }>;
    findAll(req: any, query: QueryAdGroupsDto): Promise<{
        data: {
            budget: number;
            bidAmount: number;
            id: string;
            tenantId: string;
            campaignId: string;
            externalId: string | null;
            name: string;
            status: import(".prisma/client").$Enums.AdGroupStatus;
            bidType: string | null;
            targeting: import(".prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            campaign?: unknown;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(req: any, id: string): Promise<{
        budget: number;
        bidAmount: number;
        id: string;
        tenantId: string;
        campaignId: string;
        externalId: string | null;
        name: string;
        status: import(".prisma/client").$Enums.AdGroupStatus;
        bidType: string | null;
        targeting: import(".prisma/client").Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        campaign?: unknown;
    }>;
    update(req: any, id: string, updateAdGroupDto: UpdateAdGroupDto): Promise<{
        [key: string]: unknown;
        id: string;
        name: string;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
