import nodemailer from 'nodemailer';

/* Gmail-only Nodemailer Service
   Required env:
     MAIL_USER  -> your Gmail address
     MAIL_PASS  -> 16-char App Password (NOT normal password)
   Optional:
     DEBUG_EMAIL=true  -> verbose logs
*/

const debugEmail = process.env.DEBUG_EMAIL === 'true';
const needed = ['MAIL_USER', 'MAIL_PASS'];
const missing = needed.filter(v => !process.env[v]);
if (missing.length) {
  console.error('[emailService] Missing env vars:', missing.join(', '));
  throw new Error('Email service not configured (Gmail)');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});

if (debugEmail) {
  console.log('[emailService][debug] Using Gmail transport for', process.env.MAIL_USER);
}

transporter.verify()
  .then(() => console.log('[emailService] Gmail transport verified.'))
  .catch(err => console.error('[emailService] Gmail verify failed:', err.message));

function fromAddress() {
  return `Book Cafe <${process.env.MAIL_USER}>`;
}

export async function sendVerificationCode(to, code) {
  const subject = 'Email Change Verification Code';
  const text = `Your verification code is: ${code} (valid 10 minutes)`;
  const html = `<p>Your verification code is: <b>${code}</b></p><p>It is valid for 10 minutes.</p>`;
  const mailOptions = { from: fromAddress(), to, subject, text, html };
  try {
    const info = await transporter.sendMail(mailOptions);
    if (debugEmail) console.log('[emailService][debug] Sent id:', info.messageId, 'response:', info.response);
    return info.messageId;
  } catch (err) {
    console.error('[emailService] Send failed:', err.message);
    if (err && err.code === 'EAUTH') {
      console.error('[emailService] Gmail authentication failed. Ensure you are using an App Password.');
    }
    throw new Error('Failed to send verification email');
  }
}

export default { sendVerificationCode };
