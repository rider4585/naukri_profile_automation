import { chromium } from "playwright";
import config from "./config.service.js";
import logger from "./logger.service.js";

class BrowserService {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async launch(storageState = undefined) {
        logger.info("Launching browser...");

        this.browser = await chromium.launch({
            headless: config.headless,
        });

        this.context = await this.browser.newContext({
            storageState,
        });

        // 🔥 enable trace
        await this.context.tracing.start({
            screenshots: true,
            snapshots: true,
        });

        this.page = await this.context.newPage();

        return this.page;
    }

    async close() {
        logger.info("Closing browser...");

        try {
            if (this.context) {
                await this.context.tracing.stop({
                    path: `artifacts/trace-${Date.now()}.zip`,
                });
            }
        } catch {}

        if (this.page) await this.page.close().catch(() => {});
        if (this.context) await this.context.close().catch(() => {});
        if (this.browser) await this.browser.close().catch(() => {});

        this.page = null;
        this.context = null;
        this.browser = null;
    }
}

export default new BrowserService();