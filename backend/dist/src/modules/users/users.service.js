"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(tenantId, createUserDto) {
        const existingUser = await this.repository.findByEmail(tenantId, createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.repository.create(tenantId, {
            ...createUserDto,
            password: hashedPassword,
        });
        return this.sanitizeUser(user);
    }
    async findAll(tenantId, query) {
        const [users, total] = await this.repository.findAll(tenantId, query);
        return {
            data: users.map(user => this.sanitizeUser(user)),
            meta: {
                total,
                page: query.page || 1,
                limit: query.limit || 10,
                totalPages: Math.ceil(total / (query.limit || 10)),
            },
        };
    }
    async findOne(tenantId, id) {
        const user = await this.repository.findOne(tenantId, id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async update(tenantId, id, updateUserDto) {
        await this.findOne(tenantId, id);
        const data = {};
        if (updateUserDto.firstName !== undefined) {
            data.firstName = updateUserDto.firstName;
        }
        if (updateUserDto.lastName !== undefined) {
            data.lastName = updateUserDto.lastName;
        }
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.role !== undefined) {
            data.role = updateUserDto.role;
        }
        if (updateUserDto.isActive !== undefined) {
            data.isActive = updateUserDto.isActive;
        }
        const user = await this.repository.update(tenantId, id, data);
        return this.sanitizeUser(user);
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        const user = await this.repository.remove(tenantId, id);
        return this.sanitizeUser(user);
    }
    sanitizeUser(user) {
        const { password, ...result } = user;
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map