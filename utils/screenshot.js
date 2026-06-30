import fs from "fs";
import path from "path";

export async function takeScreenshot(page, name = "error") {
    const dir = "screenshots";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(
        dir,
        `${name}-${Date.now()}.png`
    );

    await page.screenshot({
        path: filePath,
        fullPage: true,
    });

    return filePath;
}