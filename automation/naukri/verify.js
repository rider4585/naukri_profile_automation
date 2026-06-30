import logger from "../../services/logger.service.js";
import selectors from "./selectors.js";
import { randomDelay } from "../../utils/humanDelay.js";

const normalize = (text = "") =>
    text.replace(/\s+/g, " ").trim();

export async function verifyHeadline(page, expectedHeadline) {
    logger.info("Verifying resume headline");

    await randomDelay(200, 500);

    const headlineText = page.locator(selectors.profile.headlineView);

    // 🚀 faster + retry-safe polling instead of fixed long wait
    await headlineText.waitFor({
        state: "visible",
        timeout: 8000,
    });

    let actualHeadline = "";

    // 🔁 small retry loop for UI consistency (fast but safe)
    for (let i = 0; i < 5; i++) {
        actualHeadline = await headlineText.textContent();
        actualHeadline = normalize(actualHeadline);

        if (actualHeadline) break;

        await new Promise(r => setTimeout(r, 300));
    }

    if (!actualHeadline) {
        throw new Error("Headline not found in read-only view");
    }

    const expected = normalize(expectedHeadline);

    if (actualHeadline !== expected) {
        throw new Error(
            `Headline mismatch.\nExpected: ${expected}\nGot: ${actualHeadline}`
        );
    }

    logger.info("Headline verified successfully");
}