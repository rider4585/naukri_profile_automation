import browserService from "../../services/browser.service.js";
import logger from "../../services/logger.service.js";
import { sendSuccessEmail } from "../../services/email.service.js";

import { login } from "./login.js";
import { openProfile } from "./profile.js";
import { updateHeadline } from "./headline.js";
import { verifyHeadline } from "./verify.js";

import { handleError } from "../../utils/errorHandler.js";

export async function runNaukriAutomation(account, slot) {
    const page = await browserService.launch();

    try {
        logger.info(`Starting automation for: ${account.name}`);

        await login(page, account);

        await openProfile(page);

        const updatedHeadline = await updateHeadline(page);

        await verifyHeadline(page, updatedHeadline);

        logger.info(`Automation completed for: ${account.name}`);

        await sendSuccessEmail({
            account,
            headline: updatedHeadline,
            slot
        });
    } catch (err) {
        await handleError({
            page,
            account,
            step: "Naukri Automation Flow",
            error: err,
        });

        throw err;
    } finally {
        await browserService.close();
    }
}