import retry from "./retry.js";
import config from "../services/config.service.js";
import { randomDelay } from "./humanDelay.js";
import { waitForUIIdle } from "./waitForUI.js";
import { waitForOverlayToDisappear } from "./waitForOverlay.js";

const options = (name) => ({
    retries: config.retryCount,
    delay: config.retryDelay,
    operationName: name,
});

export async function safeGoto(page, url, waitUntil = "domcontentloaded") {
    await randomDelay(800, 2000);

    return retry(
        () => page.goto(url, { waitUntil }),
        options(`Goto: ${url}`)
    );
}

export async function safeClick(locator, name = "Click") {
    return retry(async () => {
        await locator.waitFor({ state: "visible" });

        await waitForOverlayToDisappear(locator.page()); // 🔥 key fix

        await locator.scrollIntoViewIfNeeded();

        await locator.click({ delay: 50 });

        if (name.includes("Navigate") || name.includes("Login")) {
            await waitForUIIdle(locator.page());
        }
    }, options(name));
}

export async function safeFill(locator, value, name = "Fill") {
    return retry(async () => {
        await locator.waitFor({ state: "visible" });

        await waitForUIIdle(locator.page());

        await locator.fill("");

        await locator.type(value, { delay: 30 });

        await waitForUIIdle(locator.page());
    }, options(name));
}

export async function safeInputValue(locator, name = "Read Input") {
    return retry(async () => {
        await locator.waitFor({ state: "visible" });
        return locator.inputValue();
    }, options(name));
}

export async function safeWaitForURL(page, url, name = "Wait For URL") {
    return retry(
        () => page.waitForURL(url),
        options(name)
    );
}

export async function fastClick(locator, name = "Click") {
    return retry(async () => {
        await locator.waitFor({ state: "visible", timeout: 10000 });

        await locator.scrollIntoViewIfNeeded();

        // 🚀 no UI idle wait, no heavy checks
        await locator.click({ delay: 20 });
    }, options(name));
}