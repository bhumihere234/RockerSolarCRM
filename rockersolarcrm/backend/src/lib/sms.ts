import Vonage from "@vonage/server-sdk";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

const sendSms = (from: string, to: string, text: string) => {
  // Corrected to use 'vonage.messages.sendSms'
  vonage.messages.sendSms(from, to, text, (err: any, responseData: any) => { // Explicitly typed 'err' and 'responseData'
    if (err) {
      console.error("Error sending SMS:", err);
    } else {
      console.log("SMS sent successfully:", responseData);
    }
  });
};

export { sendSms };
