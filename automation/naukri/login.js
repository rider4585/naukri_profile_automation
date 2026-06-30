import selectors from "./selectors.js";
import {
    safeGoto,
    safeFill,
    safeClick,
    safeWaitForURL,
} from "../../utils/safeActions.js";
import logger from "../../services/logger.service.js";

export async function login(page, account) {
    logger.info(`Logging in: ${account.name}`);

    await safeGoto(page, selectors.urls.login);

    await safeFill(
        page.locator(selectors.login.email),
        account.email,
        "Fill Email"
    );

    await safeFill(
        page.locator(selectors.login.password),
        account.password,
        "Fill Password"
    );

    await safeClick(
        page.locator(selectors.login.submit),
        "Click Login"
    );

    await safeWaitForURL(page, selectors.urls.home, "Wait For Homepage");
}