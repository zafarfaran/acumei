import nodemailer from 'nodemailer';

let transport = null;

export function isConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transport;
}

export async function sendEmail({ to, subject, text, fromName }) {
  if (!isConfigured()) throw new Error('Email not configured: set GMAIL_USER and GMAIL_APP_PASSWORD in outbound/.env');
  const from = fromName ? `"${fromName}" <${process.env.GMAIL_USER}>` : process.env.GMAIL_USER;
  return getTransport().sendMail({ from, to, subject, text });
}
