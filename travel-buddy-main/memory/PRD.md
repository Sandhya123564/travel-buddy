# Travel Buddy MVP - Product Requirements Document

## Original Problem Statement
Build a Travel Buddy MVP - A platform connecting travelers with verified travel companions (buddies) who can assist them during flights.

## Architecture Summary
- **Frontend**: React 19 with React Router, Tailwind CSS, Shadcn/UI components
- **Backend**: FastAPI (Python) with async MongoDB (Motor)
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt password hashing
- **File Storage**: Local file storage for document uploads
- **Email**: SendGrid (MOCKED - logs to console)

## User Personas
1. **Travelers**: Users seeking assistance during flights
2. **Buddies**: Verified travel companions offering assistance
3. **Admins**: Platform managers who verify buddies and handle disputes

## Core Requirements (Static)
1. User registration with email/OTP verification
2. Role selection (traveler/buddy/admin)
3. Buddy profile with experience, languages, bio, hourly rate
4. Document upload for buddy verification
5. Search buddies by date, airports, language, experience
6. Booking system (request/accept/decline/cancel/complete)
7. Review and rating system
8. Admin verification panel

## What's Been Implemented (Jan 2026)
- [x] User authentication (register, login, JWT, OTP verification - MOCKED)
- [x] Role-based access control (traveler/buddy/admin)
- [x] Buddy profile management
- [x] Document upload for verification
- [x] Buddy availability calendar
- [x] Search buddies with filters (date, airport, language, experience)
- [x] Booking workflow (request -> accept/decline -> complete)
- [x] Review system with ratings
- [x] Admin panel with:
  - Dashboard stats
  - Pending buddy verifications
  - All bookings view
  - Verify/Reject buddies
- [x] Modern, vibrant travel-themed UI
- [x] Default admin account (admin@travelbuddy.com / Admin123!)

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Configure SendGrid with real API key for email sending
- [ ] Add password reset functionality
- [ ] Implement proper file URL handling for documents

### P1 - Important
- [ ] Payment integration (Stripe)
- [ ] Escrow system for booking payments
- [ ] In-app messaging between traveler and buddy
- [ ] Email reminders 24h before flight

### P2 - Nice to Have
- [ ] Mobile responsive improvements
- [ ] Emergency contact feature
- [ ] Insurance add-on
- [ ] Buddy earnings dashboard with payment history
- [ ] Advanced search with flight number lookup

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email OTP
- `GET /api/auth/me` - Get current user
- `GET /api/buddies` - Search verified buddies
- `GET /api/buddies/{id}` - Get buddy profile
- `GET/PUT /api/buddy/profile` - Manage own buddy profile
- `PUT /api/buddy/availability` - Update availability
- `POST /api/buddy/documents` - Upload documents
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get my bookings
- `PUT /api/bookings/{id}/status` - Update booking status
- `POST /api/reviews` - Create review
- `GET /api/reviews/buddy/{id}` - Get buddy reviews
- `GET /api/admin/pending-buddies` - Admin: Get pending verifications
- `PUT /api/admin/buddy/{id}/verify` - Admin: Verify/Reject buddy
- `GET /api/admin/bookings` - Admin: All bookings
- `GET /api/admin/stats` - Admin: Dashboard stats

## Next Tasks
1. Set up SendGrid API key for email notifications
2. Add password reset flow
3. Implement Stripe payment integration
4. Add in-app messaging with Socket.io
