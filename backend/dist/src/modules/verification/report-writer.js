"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReportWriter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportWriter = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const output_path_policy_1 = require("../../toolkit/core/output-path-policy");
let ReportWriter = ReportWriter_1 = class ReportWriter {
    constructor() {
        this.logger = new common_1.Logger(ReportWriter_1.name);
    }
    async writeReport(result, outputDir) {
        const normalizedDir = (0, output_path_policy_1.resolveOutputDir)('report', outputDir);
        if (!/^[a-zA-Z0-9_-]+$/.test(result.meta.runId)) {
            throw new Error(`Security Violation: Invalid Run ID '${result.meta.runId}'. Run ID must be alphanumeric.`);
        }
        const filename = `verify-${result.meta.runId}.json`;
        const fullPath = path.join(normalizedDir, filename);
        const jsonContent = this.canonicalize(result);
        const tmpPath = `${fullPath}.tmp`;
        try {
            await fs.promises.mkdir(normalizedDir, { recursive: true });
            await fs.promises.writeFile(tmpPath, jsonContent, 'utf8');
            await fs.promises.rename(tmpPath, fullPath);
            this.logger.log(`Report written to ${fullPath}`);
            return fullPath;
        }
        catch (e) {
            this.logger.error(`Failed to write report: ${e.message}`);
            try {
                await fs.promises.unlink(tmpPath);
            }
            catch { }
            throw e;
        }
    }
    canonicalize(obj) {
        if (obj === null || typeof obj !== 'object') {
            return JSON.stringify(obj);
        }
        if (Array.isArray(obj)) {
            return '[' + obj.map(item => this.canonicalize(item)).join(',') + ']';
        }
        const keys = Object.keys(obj).sort();
        const parts = keys.map(key => {
            const val = this.canonicalize(obj[key]);
            return `"${key}":${val}`;
        });
        return '{' + parts.join(',') + '}';
    }
};
exports.ReportWriter = ReportWriter;
exports.ReportWriter = ReportWriter = ReportWriter_1 = __decorate([
    (0, common_1.Injectable)()
], ReportWriter);
//# sourceMappingURL=report-writer.js.map