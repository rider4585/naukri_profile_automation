import "../config/env.js";

import defaults from "../config/defaults.js";
import validateEnv from "../config/validator.js";

validateEnv();

const config = {
    headless:
        process.env.HEADLESS?.toLowerCase() === "true" ?? defaults.HEADLESS,
    forceRun: process.env.FORCE_RUN === "true",

    retryCount: Number(process.env.RETRY_COUNT ?? defaults.RETRY_COUNT),
    retryDelay: Number(process.env.RETRY_DELAY ?? defaults.RETRY_DELAY),

    networkRetryInterval: Number(
        process.env.NETWORK_RETRY_INTERVAL ??
        defaults.NETWORK_RETRY_INTERVAL
    ),

    networkTimeout: Number(
        process.env.NETWORK_TIMEOUT ??
        defaults.NETWORK_TIMEOUT
    ),

    timezone: process.env.TIMEZONE ?? defaults.TIMEZONE,

    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    emailTo: process.env.EMAIL_TO,

    accounts: JSON.parse(process.env.NAUKRI_ACCOUNTS),

    features: {
        successEmail:
            process.env.ENABLE_SUCCESS_EMAIL === "true",

        screenshots:
            process.env.ENABLE_SCREENSHOTS !== "false",

        storageState:
            process.env.ENABLE_STORAGE_STATE !== "false",

        htmlEmail:
            process.env.ENABLE_HTML_EMAIL !== "false",
    },
};

export default config;