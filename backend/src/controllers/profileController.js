import { updatePersonProfile, findById } from '../models/personModel.js';

export async function updateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: true, message: 'Unauthorized' });
    const fields = req.body || {};
    const updated = await updatePersonProfile(userId, fields);
    if (!updated) return res.status(400).json({ error: true, message: 'Nothing to update' });
    return res.json({ success: true, profile: updated });
  } catch (e) {
    console.error('[UPDATE_PROFILE]', e);
    return res.status(500).json({ error: true, message: 'Failed to update profile' });
  }
}

export async function getProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: true, message: 'Unauthorized' });
    const user = await findById(userId);
    if (!user) return res.status(404).json({ error: true, message: 'Not found' });
    // Remove sensitive fields
    delete user.password;
    delete user.verifyCode;
    delete user.new_email;
    delete user.verifyCodeExpires;
    return res.json({ profile: user });
  } catch (e) {
    console.error('[GET_PROFILE]', e);
    return res.status(500).json({ error: true, message: 'Failed to load profile' });
  }
}

export default { updateProfile, getProfile };