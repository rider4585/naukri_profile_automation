import config from "./services/config.service.js";
import logger from "./services/logger.service.js";
import { appendHistory } from "./services/state.service.js";

import { getTodaySchedule, shouldRunNow, markDone } from "./services/scheduler.service.js";
import { runNaukriAutomation } from "./automation/naukri/naukri.service.js";

import { acquireLock, releaseLock } from "./utils/lock.js";
import { getAccounts } from "./services/account.service.js";

process.on("uncaughtException", (err) => {
    console.error("🔥 UNCAUGHT EXCEPTION:");
    console.error(err?.message || err);
});

process.on("unhandledRejection", (reason) => {
    console.error("🔥 UNHANDLED REJECTION:");
    console.error(reason?.message || reason);
});

async function main() {
    const locked = acquireLock();

    if (!locked) {
        logger.warn("Another execution running. Exiting.");
        return;
    }

    let slot = null;

    try {
        const schedule = getTodaySchedule();
        slot = shouldRunNow(schedule);

        if (config.forceRun) {
            logger.warn("FORCE_RUN enabled. Ignoring scheduler.");
            slot = "manual";
        }

        if (!slot) {
            logger.info("Not scheduled time. Exiting.");
            return;
        }

        logger.info(`Triggering ${slot} run`);

        const accounts = getAccounts();

        for (const account of accounts) {
            logger.info(`Processing account: ${account.name}`);

            await runNaukriAutomation(account, slot);
        }

        markDone(slot);

        logger.info(`${slot} run completed`);

        appendHistory({
            time: new Date().toISOString(),
            slot,
            accounts: config.accounts.map(a => a.name),
            status: "success"
        });

    } catch (err) {
        logger.error(`Fatal scheduler error: ${err.message}`);

        appendHistory({
            time: new Date().toISOString(),
            slot: slot || "unknown",
            status: "failed"
        });

    } finally {
        releaseLock();
    }
}

main();