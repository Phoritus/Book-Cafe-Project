import express from 'express';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import bookRoutes from './routes/books.js';
import borrowingRoutes from './routes/borrowing.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);
app.use('/books', bookRoutes);
app.use('/borrowing', borrowingRoutes);
app.use('/dashboard', dashboardRoutes);

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

// Start server after DB test
testConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to DB on server start:', err);
    process.exit(1);
  });