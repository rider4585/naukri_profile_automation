export function randomDelay(min = 500, max = 2000) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((r) => setTimeout(r, ms));
}