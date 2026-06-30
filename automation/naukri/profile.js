import selectors from "./selectors.js";
import { safeGoto, fastClick } from "../../utils/safeActions.js";
import logger from "../../services/logger.service.js";

export async function openProfile(page) {
    logger.info("Opening profile page");

    await safeGoto(page, selectors.urls.profile);

    await fastClick(
        page.locator(selectors.profile.headlineEdit),
        "Open Resume Headline Editor"
    );
}