"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputPathPolicyError = void 0;
exports.getDefaultOutputRoot = getDefaultOutputRoot;
exports.getAllowedOutputRoots = getAllowedOutputRoots;
exports.resolveOutputDir = resolveOutputDir;
const path = require("path");
class OutputPathPolicyError extends Error {
    constructor(message) {
        super(message);
        this.code = 'OUTPUT_PATH_BLOCKED';
        this.exitCode = 78;
        this.name = 'OutputPathPolicyError';
    }
}
exports.OutputPathPolicyError = OutputPathPolicyError;
function isSubPath(root, candidate) {
    const rel = path.relative(root, candidate);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}
function parseRootsFromEnv(envVar) {
    if (!envVar)
        return [];
    return envVar
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => path.resolve(v));
}
function unique(values) {
    return Array.from(new Set(values));
}
function getDefaultOutputRoot(kind) {
    if (kind === 'manifest') {
        return path.resolve(process.cwd(), 'toolkit-manifests');
    }
    return path.resolve(process.cwd(), 'artifacts', 'reports');
}
function getAllowedOutputRoots(kind) {
    const defaultRoot = getDefaultOutputRoot(kind);
    const envVar = kind === 'manifest'
        ? process.env.TOOLKIT_ALLOWED_MANIFEST_ROOTS
        : process.env.TOOLKIT_ALLOWED_REPORT_ROOTS;
    const extraRoots = parseRootsFromEnv(envVar);
    return unique([defaultRoot, ...extraRoots]);
}
function resolveOutputDir(kind, requestedDir) {
    const resolved = requestedDir
        ? path.resolve(requestedDir)
        : getDefaultOutputRoot(kind);
    const allowedRoots = getAllowedOutputRoots(kind);
    const allowed = allowedRoots.some(root => isSubPath(root, resolved));
    if (!allowed) {
        const roots = allowedRoots.join(', ');
        throw new OutputPathPolicyError(`Output path "${resolved}" is outside allowlisted ${kind} roots: [${roots}]`);
    }
    return resolved;
}
//# sourceMappingURL=output-path-policy.js.map