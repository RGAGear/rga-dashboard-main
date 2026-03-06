"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoOpsLogger = void 0;
const pino_1 = require("pino");
const Redactor = require("../../manifest/redactor");
class PinoOpsLogger {
    constructor(env, bindings = {}) {
        const destination = env === 'CI' ? pino_1.default.destination(1) : pino_1.default.destination(2);
        const transport = env === 'LOCAL'
            ? pino_1.default.transport({
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                },
            })
            : undefined;
        this.logger = (0, pino_1.default)({
            level: process.env.LOG_LEVEL || 'info',
            base: {
                env,
                ...bindings,
            },
            serializers: {
                err: (err) => {
                    const sanitized = Redactor.sanitizeError(err);
                    return {
                        type: 'Error',
                        message: sanitized.message,
                        code: sanitized.code,
                    };
                },
            },
            hooks: {
                logMethod(inputArgs, method, level) {
                    if (inputArgs.length >= 2 && typeof inputArgs[0] === 'object' && inputArgs[0] !== null) {
                        const originalObj = inputArgs[0];
                        inputArgs[0] = Redactor.redactArgs(originalObj);
                    }
                    return method.apply(this, inputArgs);
                }
            }
        }, transport || destination);
    }
    info(arg1, arg2) {
        this.logger.info(arg1, arg2);
    }
    warn(arg1, arg2) {
        this.logger.warn(arg1, arg2);
    }
    error(arg1, arg2) {
        this.logger.error(arg1, arg2);
    }
    debug(arg1, arg2) {
        this.logger.debug(arg1, arg2);
    }
    child(bindings) {
        const redactedBindings = Redactor.redactArgs(bindings);
        const childPino = this.logger.child(redactedBindings);
        return new PinoLoggerWrapper(childPino);
    }
}
exports.PinoOpsLogger = PinoOpsLogger;
class PinoLoggerWrapper {
    constructor(logger) {
        this.logger = logger;
    }
    info(arg1, arg2) {
        this.logger.info(arg1, arg2);
    }
    warn(arg1, arg2) {
        this.logger.warn(arg1, arg2);
    }
    error(arg1, arg2) {
        this.logger.error(arg1, arg2);
    }
    debug(arg1, arg2) {
        this.logger.debug(arg1, arg2);
    }
    child(bindings) {
        const redactedBindings = Redactor.redactArgs(bindings);
        return new PinoLoggerWrapper(this.logger.child(redactedBindings));
    }
}
//# sourceMappingURL=ops-logger.js.map