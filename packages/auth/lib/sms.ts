
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export async function sendSms(to: string, message: string) {
    try {
        await client.messages.create({
            body: message,
            from: fromPhone,
            to,
        });
    } catch (error) {
        console.error("Failed to send SMS", error);
        throw new Error("SMS sending failed");
    }
}
