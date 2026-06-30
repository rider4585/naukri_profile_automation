import config from "./config.service.js";

export function getAccounts() {
    return config.accounts || [];
}