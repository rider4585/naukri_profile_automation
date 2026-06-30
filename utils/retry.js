import sleep from "./sleep.js";
import logger from "../services/logger.service.js";

export default async function retry(
    operation,
    {
        retries = 3,
        delay = 1000,
        factor = 2,
        operationName = "Operation",
    } = {}
) {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            // 🔥 SAFE LOGGING ONLY
            logger.warn(
                `${operationName} failed (Attempt ${attempt}/${retries}): ${
                    error?.message || "Unknown error"
                }`
            );

            if (attempt < retries) {
                await sleep(delay);
                delay *= factor;
            }
        }
    }

    throw lastError;
}