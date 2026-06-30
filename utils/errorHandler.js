import { takeScreenshot } from "./screenshot.js";
import { sendFailureEmail } from "../services/email.service.js";
import logger from "../services/logger.service.js";

export async function handleError({ page, account, step, error }) {
    try {
        logger.error(`${step} failed: ${error?.message || "unknown error"}`);

        // 🔥 SAFE extraction ONLY (no Playwright objects)
        const safePayload = {
            account: account?.name || "unknown",
            step: step || "unknown",
            message: error?.message || "unknown error",
            stack: error?.stack || "",
            url: page ? await safeGetUrl(page) : "unknown",
            time: new Date().toISOString(),
        };

        await sendFailureEmail(safePayload);
    } catch (err) {
        logger.error(`handleError failed: ${err.message}`);
    }
}

/* 🔥 SAFE helper (prevents Playwright leaks) */
async function safeGetUrl(page) {
    try {
        return typeof page?.url === "function" ? page.url() : "unknown";
    } catch {
        return "unknown";
    }
}