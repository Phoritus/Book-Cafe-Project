import nodemailer from 'nodemailer';

// Minimal Gmail transporter (you can later re-apply advanced/fallback logic if needed)
// Make sure MAIL_USER = full Gmail and MAIL_PASS = App Password (NOT normal password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Optional verify (won't crash app if fails)
transporter.verify()
  .then(() => console.log('[emailService] Transport ready'))
  .catch(err => console.error('[emailService] Transport verify failed:', err.code || err.message));

function fromAddress() {
  return `Book Cafe <${process.env.MAIL_USER || 'no-reply@example.com'}>`;
}

export async function sendVerificationCode(to, code) {
  const subject = 'Verification Code';
  const text = `Your verification code is: ${code}`;
  const html = `<p>Your verification code is: <b>${code}</b></p><p>It is valid for <strong>60 seconds</strong>. If it expires, request a new one.</p>`;
  try {
    const info = await transporter.sendMail({ from: fromAddress(), to, subject, text, html });
    return info.messageId;
  } catch (err) {
    console.error('[emailService] Send failed:', err.code || err.message);
    throw new Error('Failed to send verification email');
  }
}

export default { sendVerificationCode };
