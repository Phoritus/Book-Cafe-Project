import sgMail from '@sendgrid/mail';

// Expect: SENDGRID_API_KEY, EMAIL_FROM (optional fallback to no-reply)
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.warn('[emailService] Missing SENDGRID_API_KEY – emails will fail until set');
} else {
  sgMail.setApiKey(apiKey);
  console.log('[emailService] SendGrid client initialized');
}


export async function sendVerificationCode(to, code) {
  const subject = 'Email Change Verification Code';
  const text = `Your verification code is: ${code} (valid 10 minutes)`;
  const html = `<p>Your verification code is: <b>${code}</b></p><p>It is valid for 10 minutes.</p>`;
  try {
    const [response] = await sgMail.send({
      to: 'cpre6605@gmail.com',
      from: 'cafebook276@gmail.com',
      subject,
      text,
      html
    });
    return response?.headers?.['x-message-id'] || response?.headers?.['x-sendgrid-message-id'] || 'sent';
  } catch (err) {
    console.error('[emailService] Send failed:', err.code || err.message || err);
    throw new Error('Failed to send verification email');
  }
}

export default { sendVerificationCode };
