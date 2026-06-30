import fs from "fs";

const FILE = "state.json";
const HISTORY_FILE = "history.json";

/* 🔥 SAFE serializer (removes Playwright + functions) */
function sanitize(obj) {
    try {
        return JSON.parse(
            JSON.stringify(obj, (key, value) => {
                // remove Playwright internals + functions
                if (
                    key.startsWith("_") ||
                    typeof value === "function"
                ) {
                    return undefined;
                }

                // strip huge objects (page, frame, etc.)
                if (
                    value &&
                    typeof value === "object" &&
                    (value.constructor?.name === "Page" ||
                        value.constructor?.name === "Frame" ||
                        value.constructor?.name === "Browser" ||
                        value.constructor?.name === "Locator")
                ) {
                    return undefined;
                }

                return value;
            })
        );
    } catch {
        return {};
    }
}

export function loadState() {
    if (!fs.existsSync(FILE)) return null;

    try {
        const data = fs.readFileSync(FILE, "utf-8");
        if (!data.trim()) return null;

        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function saveState(state) {
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
}

export function appendHistory(entry) {
    let data = [];

    if (fs.existsSync(HISTORY_FILE)) {
        try {
            const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
            data = raw.trim() ? JSON.parse(raw) : [];
        } catch {
            data = [];
        }
    }

    // 🔥 CRITICAL FIX
    const safeEntry = sanitize(entry);

    data.push(safeEntry);

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}