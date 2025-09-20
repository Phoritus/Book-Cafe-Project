import { verifyAccessToken } from '../utils/jwt.js';
import { findById } from '../models/personModel.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: true, message: 'Missing token' });
    }
    const payload = verifyAccessToken(token);
    const user = await findById(payload.id || payload.person_id || payload.sub);
    if (!user) return res.status(401).json({ error: true, message: 'Invalid token user' });
    req.user = { id: user.person_id, email: user.email, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: true, message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: true, message: 'Forbidden' });
    }
    next();
  };
}
