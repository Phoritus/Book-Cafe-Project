import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import { verifyRequiredEnv, DEFAULT_REQUIRED_ENV } from './utils/envCheck.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import bookRoutes from './routes/books.js';
import borrowingRoutes from './routes/borrowing.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import { corsOptions } from './config/corsOptionsControllers.js';

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// CORS preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Routes
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);
app.use('/books', bookRoutes);
app.use('/borrowing', borrowingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', profileRoutes);

// Simple 404
app.use((req, res, next) => {
  res.status(404).json({ error: true, message: 'Not Found' });
});

// Error handler (minimal)
app.use((err, req, res, next) => {
  console.error('[ERR]', err); // basic log
  const status = err.status || 500;
  res.status(status).json({ error: true, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;

// Verify required env vars first
const envResult = verifyRequiredEnv(DEFAULT_REQUIRED_ENV);
if (!envResult.ok) {
  console.error('[STARTUP] Aborting due to missing env vars.');
  process.exit(1);
}

// Start server after DB test
testConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to DB on server start:', err);
    process.exit(1);
  });