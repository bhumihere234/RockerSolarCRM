import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendEmailOtp(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || "Rocker CRM <no-reply@rockersolar.com>",
    to,
    subject: "Your Rocker CRM verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <b>${code}</b>. It expires in 10 minutes.</p>`,
  });
}
