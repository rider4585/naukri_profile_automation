import fs from "fs";
import path from "path";

const LOG_DIR = "logs";

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

function timestamp() {
    return new Date().toISOString();
}

function logFile() {
    const date = new Date().toISOString().split("T")[0];
    return path.join(LOG_DIR, `${date}.log`);
}

/* 🔥 SAFE SERIALIZER */
function safeStringify(input) {
    try {
        if (typeof input === "string") return input;

        if (input instanceof Error) {
            return input.message;
        }

        return JSON.stringify(input, (key, value) => {
            // 🚨 strip Playwright internals
            if (
                key.startsWith("_") ||
                typeof value === "function"
            ) {
                return undefined;
            }
            return value;
        });
    } catch {
        return "[Unserializable Value]";
    }
}

function write(level, message) {
    const line = `[${timestamp()}] ${level} ${safeStringify(message)}`;

    console.log(line);

    fs.appendFileSync(logFile(), line + "\n");
}

export default {
    info: (msg) => write("INFO ", msg),
    warn: (msg) => write("WARN ", msg),
    error: (msg) => write("ERROR", msg),
    debug: (msg) => write("DEBUG", msg),

    trace: (msg, meta = {}) =>
        write("TRACE", {
            msg,
            meta: safeStringify(meta),
        }),
};