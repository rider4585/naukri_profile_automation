export async function waitForUIIdle(page) {
    // wait for network to settle
    await page.waitForLoadState("networkidle").catch(() => {});

    // small buffer for animations / overlays
    await page.waitForTimeout(800);
}