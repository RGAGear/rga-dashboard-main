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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
    }
    createTransport() {
        const host = this.config.get('SMTP_HOST');
        const port = this.config.get('SMTP_PORT');
        const secure = this.config.get('SMTP_SECURE');
        const user = this.config.get('SMTP_USER');
        const pass = this.config.get('SMTP_PASS');
        if (!host || !port || secure === undefined || !user || !pass) {
            throw new Error('SMTP is not configured. Please set SMTP_HOST/SMTP_PORT/SMTP_SECURE/SMTP_USER/SMTP_PASS');
        }
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
    }
    async sendMail(params) {
        const from = this.config.get('SMTP_FROM') || this.config.get('SMTP_USER');
        if (!from) {
            throw new Error('SMTP_FROM is not configured');
        }
        const transporter = this.createTransport();
        const info = await transporter.sendMail({
            from,
            to: params.to,
            subject: params.subject,
            html: params.html,
        });
        this.logger.log(`Email sent to ${params.to} (messageId=${info.messageId})`);
        return { messageId: info.messageId };
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map