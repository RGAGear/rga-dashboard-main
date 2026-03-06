"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleUiPrinter = void 0;
const chalk_1 = require("chalk");
const ora_1 = require("ora");
const Redactor = require("../../manifest/redactor");
class ConsoleUiPrinter {
    constructor(env) {
        this.env = env;
    }
    log(message) {
        if (this.env === 'CI') {
            console.error(message);
        }
        else {
            console.log(message);
        }
    }
    warn(message) {
        const sanitized = message;
        if (this.env === 'CI') {
            console.error(chalk_1.default.yellow(sanitized));
        }
        else {
            console.log(chalk_1.default.yellow(sanitized));
        }
    }
    error(message) {
        const safeMessage = Redactor.scrubMessage(message);
        if (this.env === 'CI') {
            console.error(chalk_1.default.red(safeMessage));
        }
        else {
            console.error(chalk_1.default.red(safeMessage));
        }
    }
    header(text) {
        if (this.env === 'CI')
            return;
        console.log(text);
    }
    spinner(text) {
        if (this.env === 'CI') {
            console.error(`[START] ${text}`);
            return {
                start: () => { },
                succeed: (t) => console.error(`[SUCCESS] ${t || text}`),
                fail: (t) => console.error(`[FAIL] ${t || text}`),
                stop: () => { },
            };
        }
        const spinner = (0, ora_1.default)(text);
        return {
            start: () => spinner.start(),
            succeed: (t) => spinner.succeed(t),
            fail: (t) => spinner.fail(t),
            stop: () => spinner.stop(),
        };
    }
}
exports.ConsoleUiPrinter = ConsoleUiPrinter;
//# sourceMappingURL=ui-printer.js.map