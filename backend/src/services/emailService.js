import nodemailer from 'nodemailer';

// DEBUG EMAIL MODE: set DEBUG_EMAIL=true to enable verbose logging
const debugEmail = process.env.DEBUG_EMAIL === 'true';

// Basic env validation (lightweight; deeper validation can reuse envCheck if needed)
const REQUIRED = ['MAIL_USER', 'MAIL_PASS'];
const missing = REQUIRED.filter(k => !process.env[k] || process.env[k].trim() === '');
if (missing.length) {
  console.error('[emailService] Missing env vars:', missing.join(', '));
}

// Explicit Gmail SMTP configuration instead of relying on service shortcut.
// This helps when encountering connection timeouts because we can tune timeouts & pooling.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Gmail SSL
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  // Timeouts (ms)
  connectionTimeout: 15_000, // time to establish TCP
  greetingTimeout: 10_000,   // waiting for greeting after connection
  socketTimeout: 20_000,     // inactivity during data transfer
});

if (debugEmail) {
  console.log('[emailService][debug] SMTP config created for', process.env.MAIL_USER);
}

async function verifyTransport() {
  try {
    await transporter.verify();
    console.log('[emailService] SMTP transport verified.');
  } catch (err) {
    console.error('[emailService] SMTP verify failed:', err.code || err.name, err.message);
    if (err.message?.includes('invalid logon') || err.code === 'EAUTH') {
      console.error('[emailService] AUTH ERROR: Ensure you are using a Gmail App Password (not your normal password).');
    } else if (err.message?.includes('timeout')) {
      console.error('[emailService] TIMEOUT: Possible firewall / blocked outbound SMTP or network latency.');
    }
  }
}
verifyTransport();

function fromAddress() {
  return `Book Cafe <${process.env.MAIL_USER || 'no-reply@example.com'}>`;
}

function classifyError(err) {
  if (!err) return 'UNKNOWN_ERROR';
  if (err.code === 'EAUTH') return 'AUTH_FAILED';
  if (err.code === 'ECONNECTION') return 'CONNECTION_FAILED';
  if (err.message?.toLowerCase().includes('timeout')) return 'CONNECTION_TIMEOUT';
  if (err.responseCode === 535) return 'AUTH_FAILED_535';
  return err.code || 'UNCLASSIFIED';
}

export async function sendVerificationCode(to, code) {
  const subject = 'Email Change Verification Code';
  const text = `Your verification code is: ${code} (valid 10 minutes)`;
  const html = `<p>Your verification code is: <b>${code}</b></p><p>It is valid for 10 minutes.</p>`;
  const mailOptions = { from: fromAddress(), to, subject, text, html };

  if (debugEmail) {
    console.log('[emailService][debug] Sending mail:', { to, subject });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    if (debugEmail) console.log('[emailService][debug] Sent id:', info.messageId, 'response:', info.response);
    return info.messageId;
  } catch (err) {
    const type = classifyError(err);
    console.error('[emailService] Send failed:', type, err.message);
    if (type === 'AUTH_FAILED' || type === 'AUTH_FAILED_535') {
      console.error('[emailService] Gmail authentication failed. Use App Password & enable 2FA.');
    } else if (type === 'CONNECTION_TIMEOUT') {
      console.error('[emailService] Connection timed out. Check outbound SMTP (port 465) firewall / hosting provider restrictions.');
    } else if (type === 'CONNECTION_FAILED') {
      console.error('[emailService] Could not establish connection. DNS or network issue.');
    }
    throw new Error('Failed to send verification email');
  }
}

export default { sendVerificationCode };