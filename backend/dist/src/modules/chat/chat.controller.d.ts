import { ChatService } from './chat.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createSession(createSessionDto: CreateChatSessionDto, req: any): Promise<({
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
    }) | {
        message: string;
    }>;
    getSessions(queryUserId: string, req: any): Promise<({
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
    addMessage(createMessageDto: CreateChatMessageDto, req: any): Promise<{
        id: string;
        sessionId: string;
        role: string;
        content: string;
        createdAt: Date;
    } | {
        message: string;
    }>;
}
