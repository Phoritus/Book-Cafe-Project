import express from 'express';
import { createPerson, findByEmail } from '../models/personModel.js';
import { comparePassword, validatePassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';

const router = express.Router();

// POST api/auth/register
// {firstname, lastname, email, password, citizen_id, role?}
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, citizen_id, role } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: true, message: 'Weak password' });
    }
    const existing = await findByEmail(email);
    if (existing) return res.status(409).json({ error: true, message: 'Email already registered' });

    // Only allow role override if explicitly provided and is 'admin' (could tighten this later to admin-only context)
    const newUser = await createPerson({ firstname, lastname, email, password, citizen_id, role: role === 'admin' ? 'admin' : 'user' });
    return res.status(201).json({ user: { id: newUser.person_id, email: newUser.email, role: newUser.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: true, message: 'Missing credentials' });
    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: true, message: 'Invalid email' });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: true, message: 'Invalid password' });
    
    const token = signAccessToken({ id: user.person_id, email: user.email, role: user.role });
    return res.json({ token, user: { id: user.person_id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Login failed' });
  }
});

export default router;
