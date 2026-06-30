const REQUIRED_ENV = [
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "EMAIL_TO",
    "NAUKRI_ACCOUNTS",
];

export default function validateEnv() {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

    if (missing.length) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
    }

    try {
        JSON.parse(process.env.NAUKRI_ACCOUNTS);
    } catch {
        throw new Error("NAUKRI_ACCOUNTS must be valid JSON.");
    }
}