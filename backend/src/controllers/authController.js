import { createPerson, findByEmail } from '../models/personModel.js';
import { comparePassword, validatePassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';
import { sendVerificationCode } from '../services/emailService.js';
import { deleteVerificationEntry } from '../models/registrationVerifyModel.js';

// In-memory registration code store (email -> { code, expiresAt })
// This replaces the previous Registration_Verify table to keep things simple.
const registrationCodes = new Map();
const REGISTRATION_CODE_TTL_MS = 60 * 1000; // 60 seconds

function generateNumericCode(len = 6) {
  let c = '';
  for (let i = 0; i < len; i++) c += Math.floor(Math.random() * 10);
  return c;
}

function setRegistrationCode(email, code, ttlMs = REGISTRATION_CODE_TTL_MS) { // default 60 seconds
  registrationCodes.set(email, { code, expiresAt: Date.now() + ttlMs });
}

function getRegistrationCodeEntry(email) {
  const entry = registrationCodes.get(email);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) { // expired, clean up
    registrationCodes.delete(email);
    return null;
  }
  return entry;
}

function consumeRegistrationCode(email) {
  registrationCodes.delete(email);
}

// Controller functions
export async function register(req, res) {
  try {
    let {
      title,
      nameTitle,
      firstname,
      lastname,
      dateOfBirth,
      national_id,
      citizen_id,
      phone,
      email,
      verifyCode,
      password,
      confirmPassword,
      role
    } = req.body;

    nameTitle = nameTitle || title || null;
    citizen_id = citizen_id || national_id || null;

    const missing = [];
    if (!firstname) missing.push('firstname');
    if (!lastname) missing.push('lastname');
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (!confirmPassword) missing.push('confirmPassword');
    if (!citizen_id) missing.push('citizen_id');
    if (!phone) missing.push('phone');
    if (!dateOfBirth) missing.push('dateOfBirth');
    if (!verifyCode) missing.push('verifyCode');
    if (missing.length) return res.status(400).json({ error: true, message: 'Missing required fields', fields: missing });

    if (password !== confirmPassword) return res.status(400).json({ error: true, message: 'Passwords do not match' });
    if (!validatePassword(password)) return res.status(400).json({ error: true, message: 'Weak password' });

    const errors = [];
    // Normalize phone (keep leading + and digits only)
    if (phone) {
      const raw = phone.toString();
      const normalized = raw.replace(/[^+\d]/g, '');
      phone = normalized;
    }
    if (citizen_id && !/^\d{13}$/.test(citizen_id)) errors.push('citizen_id must be 13 digits');
    if (phone && !/^[+]?\d[\d]{8,14}$/.test(phone.replace(/[^+\d]/g, ''))) errors.push('phone format invalid');
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) errors.push('dateOfBirth invalid');
      else if (dob > new Date()) errors.push('dateOfBirth cannot be in the future');
      // Enforce YYYY-MM-DD format by slicing
      dateOfBirth = dob.toISOString().slice(0,10);
    }
    if (errors.length) return res.status(400).json({ error: true, message: 'Validation errors', details: errors });

    const existing = await findByEmail(email);
    if (existing) return res.status(409).json({ error: true, message: 'Email already registered' });

    const entry = getRegistrationCodeEntry(email);
    if (!entry) return res.status(400).json({ error: true, message: 'No verification code requested or code expired' });
    if (entry.code !== verifyCode) return res.status(400).json({ error: true, message: 'Invalid verification code' });

    let newUser;
    try {
      newUser = await createPerson({
        firstname,
        lastname,
        nameTitle,
        phone,
        password,
        dateOfBirth,
        citizen_id,
        email,
        verifyCode,
        role: role === 'admin' ? 'admin' : 'user'
      });
    } catch (dbErr) {
      // MySQL duplicate email safety (in case race condition)
      if (dbErr && (dbErr.code === 'ER_DUP_ENTRY' || /duplicate/i.test(dbErr.message))) {
        return res.status(409).json({ error: true, message: 'Email already registered (db)' });
      }
      console.error('[REGISTER][DB_ERROR]', {
        code: dbErr.code,
        errno: dbErr.errno,
        sqlMessage: dbErr.sqlMessage,
        stack: dbErr.stack
      });
      return res.status(500).json({ error: true, message: 'Registration database error' });
    }
    consumeRegistrationCode(email);
    deleteVerificationEntry(email);
    return res.status(201).json({ user: { id: newUser.person_id, email: newUser.email, role: newUser.role } });
  } catch (e) {
    console.error('[REGISTER][UNCAUGHT]', e);
    return res.status(500).json({ error: true, message: 'Registration failed (unexpected)' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: true, message: 'Missing credentials' });
    const user = await findByEmail(email);
    if (!user) return res.status(401).json({ error: true, message: 'Invalid email, Please check and try again.' });
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: true, message: 'Invalid password, Please check and try again.' });
    const token = signAccessToken({ id: user.person_id, email: user.email, role: user.role });
    return res.json({ token, user: { id: user.person_id, email: user.email, role: user.role } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Login failed' });
  }
}

export async function sendRegisterCode(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: true, message: 'Email required' });
    const existing = await findByEmail(email);
    if (existing) return res.status(409).json({ error: true, message: 'Email already registered' });
    const code = generateNumericCode();
  setRegistrationCode(email, code);
    await sendVerificationCode(email, code); // reuse same email template
  return res.json({ success: true, message: 'Verification code sent (valid 5 minutes)' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: true, message: 'Failed to send code' });
  }
}

export default { register, login, sendRegisterCode };