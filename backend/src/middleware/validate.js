// Lightweight validation middleware for common endpoints
// Returns HTTP 400 with { error: true, message, fields? }

function fail(res, message, fields) {
  const body = { error: true, message };
  if (fields && fields.length) body.fields = fields;
  return res.status(400).json(body);
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) return fail(res, 'email & password required');
  next();
}

export function validateRegister(req, res, next) {
  const required = ['firstname','lastname','email','password','confirmPassword','citizen_id','phone','dateOfBirth','verifyCode'];
  const missing = required.filter(f => !(req.body && req.body[f] != null && req.body[f] !== ''));
  if (missing.length) return fail(res, 'Missing required fields', missing);
  const { email, password, confirmPassword, citizen_id, phone, dateOfBirth } = req.body;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail(res, 'Invalid email format');
  if (password !== confirmPassword) return fail(res, 'Passwords do not match');
  if (!/^\d{13}$/.test(citizen_id)) return fail(res, 'citizen_id must be 13 digits');
  if (!/^[+]?\d[\d\s-]{8,14}$/.test(phone)) return fail(res, 'phone invalid');
  if (isNaN(new Date(dateOfBirth).getTime())) return fail(res, 'dateOfBirth invalid');
  next();
}

export function validateSendRegisterCode(req, res, next) {
  if (!req.body?.email) return fail(res, 'email required');
  next();
}

export function validateCreateBooking(req, res, next) {
  const { room_number, checkIn, checkOut, totalPrice } = req.body || {};
  const missing = [];
  if (!room_number) missing.push('room_number');
  if (!checkIn) missing.push('checkIn');
  if (!checkOut) missing.push('checkOut');
  if (totalPrice == null) missing.push('totalPrice');
  if (missing.length) return fail(res, 'Missing required fields', missing);
  if (isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) return fail(res, 'Invalid checkIn/checkOut date');
  if (new Date(checkIn) > new Date(checkOut)) return fail(res, 'checkIn after checkOut');
  next();
}

export function validateCreateRoom(req, res, next) {
  const { room_number, price } = req.body || {};
  if (!room_number || price == null) return fail(res, 'room_number & price required');
  if (Number.isNaN(Number(price))) return fail(res, 'price must be number');
  next();
}

export function validateCreateBook(req, res, next) {
  const { book_id, book_name } = req.body || {};
  if (!book_id || !book_name) return fail(res, 'book_id & book_name required');
  next();
}

export default {
  validateLogin,
  validateRegister,
  validateSendRegisterCode,
  validateCreateBooking,
  validateCreateRoom,
  validateCreateBook
};
