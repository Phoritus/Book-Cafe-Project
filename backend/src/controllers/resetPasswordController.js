import { findByEmail, updateVerifyCode, findById, updatePassword } from '../models/personModel.js';
import { sendVerificationCode } from '../services/emailService.js';
import { validatePassword } from '../utils/password.js';

// In-memory map for reset password codes (email -> { code, expiresAt })
// We reuse the pattern used in authController registration codes to keep consistent.
const resetPasswordCodes = new Map();

function generateNumericCode(len = 6) {
  let c = '';
  for (let i = 0; i < len; i++) c += Math.floor(Math.random() * 10);
  return c;
}

function setResetCode(email, code, ttlMs = 10 * 60 * 1000) { // 10 minutes
  resetPasswordCodes.set(email, { code, expiresAt: Date.now() + ttlMs });
}
function getResetCodeEntry(email) {
  const entry = resetPasswordCodes.get(email);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    resetPasswordCodes.delete(email);
    return null;
  }
  return entry;
}
function consumeResetCode(email) {
  resetPasswordCodes.delete(email);
}

// POST /auth/reset-password/request { email }
export async function requestResetPasswordCode(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: true, message: 'Email required' });

    const user = await findByEmail(email);
    if (!user) {
      // For security we still return success (do not reveal if email exists)
      return res.json({ success: true, message: 'If that email exists, a code has been sent' });
    }

    const code = generateNumericCode();
    setResetCode(email, code);
    try {
      await sendVerificationCode(email, code); // reuse template
    } catch (e) {
      console.error('[requestResetPasswordCode] send email failed', e.message);
      return res.status(500).json({ error: true, message: 'Failed to send code' });
    }

    return res.json({ success: true, message: 'If that email exists, a code has been sent' });
  } catch (e) {
    console.error('[requestResetPasswordCode]', e);
    return res.status(500).json({ error: true, message: 'Failed to request reset password code' });
  }
}

// POST /auth/reset-password { email, code, password, confirmPassword }
export async function resetPassword(req, res) {
  try {
    const { email, code, password, confirmPassword } = req.body || {};
    if (!email || !code || !password || !confirmPassword) {
      return res.status(400).json({ error: true, message: 'email, code, password, confirmPassword required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: true, message: 'Passwords do not match' });
    }

    const complexity = validatePassword(password);
    if (!complexity.valid) {
      return res.status(400).json({ error: true, message: 'Weak password', details: complexity.errors });
    }

    const user = await findByEmail(email);
    if (!user) {
      // Same generic response pattern
      return res.status(400).json({ error: true, message: 'Invalid code or expired' });
    }

    const entry = getResetCodeEntry(email);
    if (!entry || entry.code !== code) {
      return res.status(400).json({ error: true, message: 'Invalid code or expired' });
    }

    await updatePassword(user.person_id, password);
    consumeResetCode(email);
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (e) {
    console.error('[resetPassword]', e);
    return res.status(500).json({ error: true, message: 'Failed to reset password' });
  }
}

export default { requestResetPasswordCode, resetPassword };