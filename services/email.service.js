import {Resend} from "resend";
import config from "./config.service.js";
import logger from "./logger.service.js";

const resend = new Resend(config.resendApiKey);

export async function sendFailureEmail({account, step, error, url, screenshot}) {
    try {
        logger.info("Sending failure email...");

        await resend.emails.send({
            from: config.emailFrom,
            to: config.emailTo,
            subject: "Naukri Automation Failed",
            html: `
                <h3>Failure Report</h3>

                <p><b>Account:</b> ${account?.name || "unknown"}</p>
                <p><b>Step:</b> ${step || "unknown"}</p>
                <p><b>Error:</b> ${error?.message || "unknown error"}</p>
                <p><b>URL:</b> ${url || "unknown"}</p>

                <pre>${error?.stack || ""}</pre>
            `,
        });

        logger.info("Failure email sent");
    } catch (err) {
        logger.error("Email failed: " + err.message);
    }
}

export async function sendSuccessEmail({account, headline, slot,}) {
    try {
        logger.info("Sending success email...");

        await resend.emails.send({
            from: config.emailFrom,
            to: config.emailTo,
            subject: `✅ Naukri Update Success - ${account.name}`,
            html: `
        <h2>Profile Updated Successfully</h2>

        <p><b>Account:</b> ${account.name}</p>
        <p><b>Slot:</b> ${slot}</p>
        <p><b>New Headline:</b> ${headline}</p>
        <p><b>Time:</b> ${new Date().toISOString()}</p>

        <hr />
        <p>Automation executed successfully without errors.</p>
      `,
        });

        logger.info("Success email sent");
    } catch (err) {
        logger.error("Success email failed: " + err.message);
    }
}