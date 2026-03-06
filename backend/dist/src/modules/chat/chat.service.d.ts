import { PrismaService } from '../prisma/prisma.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
export declare class ChatService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createSession(tenantId: string, userId: string | null, createSessionDto: CreateChatSessionDto): Promise<{
        messages: {
            id: string;
            sessionId: string;
            role: string;
            content: string;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSessions(userId: string | null): Promise<({
        _count: {
            messages: number;
        };
    } & {
        id: string;
        userId: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getSession(id: string): Promise<{
        messages: {
            id: string;
            sessionId: string;
            role: string;
            content: string;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMessage(tenantId: string, sessionId: string, createMessageDto: CreateChatMessageDto): Promise<{
        id: string;
        sessionId: string;
        role: string;
        content: string;
        createdAt: Date;
    }>;
    updateSessionTitle(id: string, title: string): Promise<{
        id: string;
        userId: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteSession(id: string): Promise<{
        id: string;
        userId: string | null;
        title: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
