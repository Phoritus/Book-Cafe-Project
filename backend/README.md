# Book Cafe Backend

Minimal backend service for a Book / Cafe hybrid system providing:
- User authentication (register + email verification code, login)
- Change email (verification via code) & change password
- Room bookings (with overlap protection & generated qrCode string)
- Book & borrowing records + analytics dashboards (rooms & borrowing)
- Basic validation middleware for key endpoints

## Tech Stack
- Node.js (Express, ES Modules)
- MySQL (mysql2/promise)
- JWT for access tokens
- Nodemailer (Gmail App Password) for sending verification codes
- dayjs for date utilities (analytics)

## Project Structure
```
backend/
  src/
    config/        # DB pool & env loading
    controllers/   # Route handlers
    middleware/    # auth + validate
  models/        # DB queries (person, booking_room, etc.)
    routes/        # Express routers
    services/      # email service
    utils/         # helpers (jwt, password)
  sql/
    schema.sql     # Create tables
    seed.sql       # Seed data (people, rooms, books, bookings, borrowings)
  .env.example
```

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy `.env.example` to `.env` and fill values:
```
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpass
MYSQL_DATABASE=booking_db
JWT_ACCESS_SECRET=change_me_secret
ACCESS_TOKEN_TTL=15m
BCRYPT_SALT_ROUNDS=10
MAIL_USER=you@gmail.com
MAIL_PASS=your_app_password
```
3. Create database then apply schema + seed (MySQL):
```sql
CREATE DATABASE booking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE booking_db;
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;
```
4. Run server (dev with nodemon):
```bash
npm run dev
```
Server: http://localhost:3000

Health check:
```
GET /health -> { "ok": true }
```

## Auth Flow
1. Request register code:
```
POST /auth/register/send-code { "email": "user@example.com" }
```
2. Register:
```
POST /auth/register {
  "firstname":"A","lastname":"User","email":"user@example.com",
  "password":"Password1","confirmPassword":"Password1",
  "citizen_id":"1234567890123","phone":"0891234567",
  "dateOfBirth":"2000-01-01","verifyCode":"123456"
}
```
3. Login:
```
POST /auth/login { "email":"user@example.com", "password":"Password1" }
```
Response includes: `{ token, user }` -> use header:
```
Authorization: Bearer <token>
```

## Key Endpoints (Summary)
Rooms:
- GET /rooms
- POST /rooms (admin)
- PATCH /rooms/:room_number/status (admin)
- GET /rooms/:room_number

Bookings:
- POST /bookings (auth) -> body includes room_number, checkIn, checkOut, totalPrice (qrCode auto if missing)
- GET /bookings (auth, own) | add ?all=1 if admin
- DELETE /bookings/:id (owner or admin)

Books:
- GET /books
- GET /books/:book_id
- POST /books (admin)
- PATCH /books/:book_id/status (admin)

Borrowing Analytics:
- GET /dashboard/borrowings/by-category?range=today|week|month|custom&start=YYYY-MM-DD&end=YYYY-MM-DD
- GET /dashboard/borrowings/top-books?limit=5&range=month

Room Analytics:
- GET /dashboard/daily?date=YYYY-MM-DD
- GET /dashboard/most-booked?start=YYYY-MM-DD&end=YYYY-MM-DD

Email / Change Email:
- POST /auth/change-email/request { newEmail }
- POST /auth/change-email/verify { email, code }

Change Password:
- POST /auth/change-password { currentPassword, newPassword }

## Validation
Lightweight middleware returns 400 JSON when required fields missing or invalid formats (see `src/middleware/validate.js`).

## qrCode Field
A random-ish string (e.g., `QR-<timestampBase36>-<rand3>`) assigned when creating a booking if not provided. PNG generation endpoint was removed; frontend can render QR client-side if needed.

## Future Improvements (Backlog)
- Environment variable presence check on startup
- Security hardening (helmet, rate limiting applied only to /auth)
- Centralized error logging / request logging
- Refresh token rotation (currently only access tokens)

## Testing (Manual Quick Checks)
```bash
# Health
curl http://localhost:3000/health
# Login
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"AdminPass1"}'
```

## License
Educational / coursework use.
