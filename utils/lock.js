import fs from "fs";

const LOCK_FILE = "execution.lock";

export function acquireLock() {
    if (fs.existsSync(LOCK_FILE)) {
        return false;
    }

    fs.writeFileSync(LOCK_FILE, String(Date.now()));
    return true;
}

export function releaseLock() {
    if (fs.existsSync(LOCK_FILE)) {
        fs.unlinkSync(LOCK_FILE);
    }
}