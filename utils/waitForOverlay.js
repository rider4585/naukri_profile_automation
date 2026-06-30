export async function waitForOverlayToDisappear(page) {
    try {
        await page.waitForFunction(() => {
            return !document.querySelector(".ltLayer.open");
        }, { timeout: 5000 });
    } catch {
        // ignore - overlay may not exist
    }
}