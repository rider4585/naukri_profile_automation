import {MailtrapClient} from "mailtrap";
import config from "./config.service.js";
import logger from "./logger.service.js";

const client = new MailtrapClient({
    token: config.resendApiKey, // reuse existing env variable
});

const sender = {
    email: config.emailFrom,
    name: "Naukri Profile Update",
};

const recipients = [
    {
        email: config.emailTo,
    },
];

export async function sendFailureEmail({account, step, error, url, screenshot}) {
    try {
        logger.info("Sending failure email...");

        await client.send({
            from: sender,
            to: recipients,
            subject: "❌ Naukri Automation Failed",
            category: "Failure",
            html: `
                <h2>Naukri Automation Failure</h2>

                <p><b>Account:</b> ${account?.name || account || "Unknown"}</p>
                <p><b>Step:</b> ${step || "Unknown"}</p>
                <p><b>Error:</b> ${error?.message || error || "Unknown Error"}</p>
                <p><b>URL:</b> ${url || "Unknown"}</p>
                <p><b>Time:</b> ${new Date().toLocaleString()}</p>

                <pre>${error?.stack || ""}</pre>
            `,
        });

        logger.info("Failure email sent");
    } catch (err) {
        logger.error("Email failed: " + err.message);
    }
}

export async function sendSuccessEmail({account, headline, slot}) {
    try {
        logger.info("Sending success email...");

        await client.send({
            from: sender,
            to: recipients,
            subject: `✅ Naukri Updated - ${account.name}`,
            category: "Success",
            html: `
                <h2>Profile Updated Successfully</h2>

                <p><b>Account:</b> ${account.name}</p>
                <p><b>Slot:</b> ${slot || "Manual Run"}</p>
                <p><b>Headline:</b> ${headline}</p>
                <p><b>Time:</b> ${new Date().toLocaleString()}</p>

                <hr>

                <p>Automation completed successfully.</p>
            `,
        });

        logger.info("Success email sent");
    } catch (err) {
        logger.error("Success email failed: " + err.message);
    }
}