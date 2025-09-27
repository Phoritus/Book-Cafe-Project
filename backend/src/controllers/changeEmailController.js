import { findByEmail, findByPendingEmail, setPendingEmail, findByIdWithPending, clearPendingEmail } from '../models/personModel.js';
import { sendVerificationCode } from '../services/emailService.js';

function randomCode(len = 6) {
  let code = '';
  for (let i = 0; i < len; i++) code += Math.floor(Math.random() * 10);
  return code;
}

// POST /auth/change-email/request { currentEmail, newEmail }
export async function   requestChangeEmail(req, res) {
  try {
    const { currentEmail, newEmail } = req.body;
    if (!currentEmail || !newEmail) {
      return res.status(400).json({ error: true, message: 'currentEmail & newEmail required' });
    }
    const user = await findByEmail(currentEmail);
    if (!user) return res.status(404).json({ error: true, message: 'Current email not found' });
    if (currentEmail === newEmail) return res.status(400).json({ error: true, message: 'Emails are the same' });

    // Check if newEmail already belongs to an existing (different) user
    const existingUserWithNew = await findByEmail(newEmail);
    if (existingUserWithNew) {
      return res.status(409).json({ error: true, message: 'New email already in use' });
    }

    // Check pending usage of that newEmail by another user
    const pendingOwner = await findByPendingEmail(newEmail);
    if (pendingOwner && pendingOwner.person_id !== user.person_id) {
      return res.status(409).json({ error: true, message: 'New email already in use (pending)' });
    }

  // Always regenerate a fresh code (Option A: always allow re-request)
  const code = randomCode();
  const expires = new Date(Date.now() + 60 * 1000); // 60 seconds
  await setPendingEmail(user.person_id, newEmail, code, expires);

    try {
      await sendVerificationCode(newEmail, code);
  return res.json({ success: true, message: 'Verification code sent to new email (valid 60s)' });
    } catch (mailErr) {
      // If email send fails, optionally clear pending data to let user retry
      console.error('[changeEmail] email send failed', mailErr);
      return res.status(500).json({ error: true, message: 'Unable to send verification email' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Failed to initiate change email' });
  }
}

// POST /auth/change-email/verify { currentEmail, newEmail, code }
export async function verifyChangeEmail(req, res) {
  try {
    const { currentEmail, newEmail, code } = req.body;
    if (!currentEmail || !newEmail || !code) {
      return res.status(400).json({ error: true, message: 'currentEmail, newEmail & code required' });
    }
    const user = await findByEmail(currentEmail);
    if (!user) return res.status(404).json({ error: true, message: 'Current email not found' });

    const fresh = await findByIdWithPending(user.person_id);
    if (!fresh || !fresh.new_email) return res.status(400).json({ error: true, message: 'No pending change' });
    if (fresh.new_email !== newEmail) return res.status(400).json({ error: true, message: 'New email mismatch' });
    if (!fresh.verifyCode || fresh.verifyCode !== code) return res.status(400).json({ error: true, message: 'Invalid code' });
    if (fresh.verifyCodeExpires && new Date(fresh.verifyCodeExpires).getTime() < Date.now()) {
      return res.status(400).json({ error: true, message: 'Code expired' });
    }

    await clearPendingEmail(user.person_id);
    return res.json({ success: true, message: 'Email updated' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Verification failed' });
  }
}

export default { requestChangeEmail, verifyChangeEmail };