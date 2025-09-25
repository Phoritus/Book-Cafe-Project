import nodemailer from 'nodemailer';

// DEBUG EMAIL MODE: set DEBUG_EMAIL=true to enable verbose logging
const debugEmail = process.env.DEBUG_EMAIL === 'true';

// Basic env validation (lightweight; deeper validation can reuse envCheck if needed)
const REQUIRED = ['MAIL_USER', 'MAIL_PASS'];
const missing = REQUIRED.filter(k => !process.env[k] || process.env[k].trim() === '');
if (missing.length) {
  console.error('[emailService] Missing env vars:', missing.join(', '));
}

// Primary transporter: SSL 465
const primaryTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true, // use STARTTLS
  logger: true,
  debug: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
  
});

// Fallback transporter: STARTTLS 587 (some hosts block 465 but allow 587)
const fallbackTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS upgrade
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  pool: false, // keep simple for fallback
  connectionTimeout: 12_000,
  greetingTimeout: 8_000,
  socketTimeout: 18_000,
});

if (debugEmail) {
  console.log('[emailService][debug] SMTP primary + fallback configured for', process.env.MAIL_USER);
}

async function verifyTransporters() {
  try {
    await primaryTransporter.verify();
    console.log('[emailService] Primary SMTP (465) verified.');
  } catch (err) {
    console.error('[emailService] Primary (465) verify failed:', err.code || err.name, err.message);
    if (err.message?.toLowerCase().includes('timeout')) {
      console.error('[emailService] Primary port 465 timeout, fallback (587) may succeed.');
    }
    try {
      await fallbackTransporter.verify();
      console.log('[emailService] Fallback SMTP (587) verified.');
    } catch (err2) {
      console.error('[emailService] Fallback (587) verify failed:', err2.code || err2.name, err2.message);
    }
  }
}
verifyTransporters();

function fromAddress() {
  return `Book Cafe <${process.env.MAIL_USER || 'no-reply@example.com'}>`;
}

function classifyError(err) {
  if (!err) return 'UNKNOWN_ERROR';
  if (err.code === 'EAUTH') return 'AUTH_FAILED';
  if (err.code === 'ECONNECTION') return 'CONNECTION_FAILED';
  if (err.message?.toLowerCase().includes('timeout') || err.code === 'ETIMEDOUT') return 'CONNECTION_TIMEOUT';
  if (err.responseCode === 535) return 'AUTH_FAILED_535';
  return err.code || 'UNCLASSIFIED';
}

async function sendWithFallback(mailOptions) {
  // Try primary first
  try {
    if (debugEmail) console.log('[emailService][debug] Sending via primary (465)');
    return await primaryTransporter.sendMail(mailOptions);
  } catch (err) {
    const type = classifyError(err);
    if (debugEmail) console.error('[emailService][debug] Primary send failed:', type, err.message);
    if (type === 'CONNECTION_TIMEOUT' || type === 'CONNECTION_FAILED') {
      // Try fallback
      try {
        if (debugEmail) console.log('[emailService][debug] Trying fallback (587 STARTTLS)');
        return await fallbackTransporter.sendMail(mailOptions);
      } catch (err2) {
        const type2 = classifyError(err2);
        if (debugEmail) console.error('[emailService][debug] Fallback send failed:', type2, err2.message);
        throw err2; // propagate
      }
    }
    throw err; // propagate other errors directly
  }
}

export async function diagnoseEmailConnectivity() {
  const results = { primary: null, fallback: null };
  try {
    await primaryTransporter.verify();
    results.primary = 'OK';
  } catch (e) {
    results.primary = 'FAIL: ' + (e.code || e.message);
  }
  try {
    await fallbackTransporter.verify();
    results.fallback = 'OK';
  } catch (e) {
    results.fallback = 'FAIL: ' + (e.code || e.message);
  }
  if (debugEmail) console.log('[emailService][diagnose]', results);
  return results;
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
    const info = await sendWithFallback(mailOptions);
    if (debugEmail) console.log('[emailService][debug] Sent id:', info.messageId, 'response:', info.response);
    return info.messageId;
  } catch (err) {
    const type = classifyError(err);
    console.error('[emailService] Send failed:', type, err.message);
    if (type === 'AUTH_FAILED' || type === 'AUTH_FAILED_535') {
      console.error('[emailService] Gmail authentication failed. Use App Password & enable 2FA.');
    } else if (type === 'CONNECTION_TIMEOUT') {
      console.error('[emailService] Connection timed out on both ports. Check outbound SMTP (465/587) firewall / hosting restrictions.');
    } else if (type === 'CONNECTION_FAILED') {
      console.error('[emailService] Could not establish connection. DNS or network issue.');
    }
    throw new Error('Failed to send verification email');
  }
}

export default { sendVerificationCode, diagnoseEmailConnectivity };