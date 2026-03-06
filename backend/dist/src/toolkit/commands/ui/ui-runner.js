"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommandSafe = runCommandSafe;
const crypto_1 = require("crypto");
const chalk_1 = require("chalk");
const core_1 = require("../../core");
const ops_logger_1 = require("../../core/observability/ops-logger");
const ui_printer_1 = require("../../core/observability/ui-printer");
const run_logger_1 = require("../../core/observability/run-logger");
const Redactor = require("../../manifest/redactor");
const hints_1 = require("../../core/hints");
async function runCommandSafe(command, tenantId, registry, options) {
    const commandName = command.name;
    const runId = (0, crypto_1.randomUUID)();
    const env = process.env.TOOLKIT_ENV === 'CI' ? 'CI' : 'LOCAL';
    const opsLogger = new ops_logger_1.PinoOpsLogger(env, {
        runId,
        command: commandName,
        tenantId: tenantId ? tenantId : 'unknown',
    });
    const printer = new ui_printer_1.ConsoleUiPrinter(env);
    const runLogger = new run_logger_1.RunLogger(printer, opsLogger);
    const context = core_1.ExecutionContextFactory.create({
        tenantId,
        dryRun: options.dryRun,
        verbose: true,
        runId,
        logger: runLogger.ops,
        printer: runLogger.printer,
    });
    const handler = registry.resolve(command.name);
    if (!handler) {
        console.log(chalk_1.default.red(`\nERROR: No handler found for command: ${commandName}\n`));
        return { success: false };
    }
    const prisma = core_1.ServiceLocator.resolve(core_1.TOKENS.PrismaClient);
    runLogger.printer.log('');
    const spinner = runLogger.printer.spinner('Executing...');
    spinner.start();
    try {
        const { result, pipeline } = await (0, core_1.executeWithSafetyManifest)({
            commandName,
            executionMode: 'CLI',
            context,
            prisma,
            args: {
                dryRun: options.dryRun,
            },
            execute: () => handler.execute(command, context),
        });
        if (result.kind === 'success') {
            spinner.succeed('Command completed successfully');
            if (pipeline?.manifestPath) {
                console.log(chalk_1.default.gray(`Manifest: ${pipeline.manifestPath}`));
            }
            return { success: true, data: result.value };
        }
        else {
            spinner.fail('Command failed');
            console.log(chalk_1.default.red(`\nError: ${result.error.message}\n`));
            (0, hints_1.printActionableHints)(commandName, result.error.message);
            if (pipeline?.manifestPath) {
                console.log(chalk_1.default.gray(`Manifest: ${pipeline.manifestPath}`));
            }
            return { success: false };
        }
    }
    catch (error) {
        spinner.fail('Unexpected error');
        runLogger.ops.error('Command execution failed', error instanceof Error ? error : undefined);
        const sanitizedError = Redactor.sanitizeError(error).message;
        runLogger.printer.error(`\n${sanitizedError}\n`);
        (0, hints_1.printActionableHints)(commandName, sanitizedError);
        return { success: false };
    }
}
//# sourceMappingURL=ui-runner.js.map