import { findById, updatePassword } from '../models/personModel.js';
import { comparePassword, validatePassword } from '../utils/password.js';

export async function changePassword(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: true, message: 'Unauthorized' });

    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: true, message: 'currentPassword, newPassword, confirmPassword required' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: true, message: 'New password and confirm password do not match' });
    }

    const complexity = validatePassword(newPassword);
    if (!complexity.valid) {
      return res.status(400).json({ error: true, message: 'Weak password', details: complexity.errors });
    }

    const user = await findById(userId);
    if (!user) return res.status(404).json({ error: true, message: 'User not found' });

    const match = await comparePassword(currentPassword, user.password);
    if (!match) return res.status(401).json({ error: true, message: 'Current password incorrect' });

    await updatePassword(userId, newPassword);
    return res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    console.error('[changePassword]', e);
    return res.status(500).json({ error: true, message: 'Failed to change password' });
  }
}

export default { changePassword };