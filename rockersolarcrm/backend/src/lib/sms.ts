
import { Vonage } from '@vonage/server-sdk';
import { config } from 'dotenv';
config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

const sendSms = async (from: string, to: string, text: string) => {
  try {
    const resp = await vonage.sms.send({
      to,
      from,
      text,
    });
    console.log('SMS sent successfully:', resp);
  } catch (err) {
    console.error('Error sending SMS:', err);
  }
};

export { sendSms };
