import selectors from "./selectors.js";
import { fastClick } from "../../utils/safeActions.js";
import logger from "../../services/logger.service.js";

export async function updateHeadline(page) {
    const input = page.locator(selectors.profile.headlineInput);

    await input.waitFor({ state: "visible", timeout: 8000 });

    const current = await input.inputValue();

    const updatedHeadline = current.endsWith(".")
        ? current.slice(0, -1)
        : current + ".";

    await input.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }, updatedHeadline);

    const saveBtn = page.locator(selectors.profile.headlineSave);

    await saveBtn.waitFor({ state: "visible", timeout: 8000 });

    await page.waitForFunction(btn => btn && !btn.disabled, saveBtn);

    await saveBtn.click({ delay: 10 });

    return updatedHeadline;
}