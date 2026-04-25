# NJBS ICT Club - Supabase Migration Setup Guide

## Overview
This project has been completely migrated from MongoDB to Supabase with a custom authentication system (not using Supabase Auth). The admin dashboard now includes full role management, QR code generation for members, and comprehensive project/event management.

## Key Changes Made

### 1. Database Migration
- **Removed**: MongoDB and Mongoose models
- **Added**: Supabase PostgreSQL database
- **Tables Created**:
  - `users` - User accounts with custom JWT auth
  - `reset_tokens` - Password reset codes (6-digit, 15min expiry)
  - `projects` - Club projects
  - `events` - Club events
  - `event_registrations` - Event attendance tracking
  - `members_projects` - Many-to-many project membership
  - `messages` - Announcements and messages

### 2. User ID Format
- **New Format**: `NJBS-YYYYMMDDHHMMSS` (e.g., `NJBS-20260425135423`)
- Generated automatically on signup
- Unique identifier for QR code generation

### 3. Authentication System
- **Type**: Custom JWT-based (NOT Supabase Auth)
- **Features**:
  - Email/password login and registration
  - Password reset with 6-digit code verification (15-minute expiry)
  - HTTP-only secure cookies
  - JWT tokens with 7-day expiration
  - Role-based access control (member/admin/moderator)

### 4. Admin Features
- **Admin Email**: sangamkunwar48@gmail.com (set as default admin)
- **Dashboard Access**: `/admin`
- **Admin Capabilities**:
  - Manage all members (view, edit, delete, change roles)
  - Generate QR codes for each member
  - Create and manage projects
  - Create and manage events
  - Track event registrations
  - View dashboard statistics

### 5. QR Code Generation
- Each member gets a unique QR code with their user ID
- QR codes are generated on-demand using the `qrcode` library
- Available via admin dashboard member detail view

## Setup Instructions

### Step 1: Verify Environment Variables
Make sure you have these in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key
```

### Step 2: Initialize Supabase Database

#### Option A: Using Setup Script (Recommended)
```bash
npm run setup:db
# or
node scripts/setup-database.js
```

#### Option B: Manual SQL Setup
1. Go to your Supabase dashboard
2. Click SQL Editor
3. Create a new query
4. Paste content from `scripts/setup-supabase.sql`
5. Click "Run"

### Step 3: Create Admin User
The setup script automatically creates the admin user:
- **Email**: sangamkunwar48@gmail.com
- **Default Password**: Admin@123 (CHANGE THIS IMMEDIATELY!)
- **Role**: admin

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/reset-password` - Reset password with code
- `GET /api/auth/me` - Get current user info

### Admin - Users
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user details with QR code
- `PUT /api/admin/users/[id]` - Update user (role, status, name, phone)
- `DELETE /api/admin/users/[id]` - Delete user

### Admin - Projects
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create new project
- `GET /api/admin/projects/[id]` - Get project details
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Admin - Events
- `GET /api/admin/events` - List all events
- `POST /api/admin/events` - Create new event
- `GET /api/admin/events/[id]` - Get event details with registrations
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event

### Admin - Stats
- `GET /api/admin/stats` - Get dashboard statistics

## Pages

### Public/Auth Pages
- `/auth/login` - Modern login page
- `/auth/signup` - Modern signup with password strength indicator
- `/auth/forgot-password` - Request password reset code
- `/auth/reset-password` - Reset password with 6-digit code verification

### Admin Pages
- `/admin` - Main admin dashboard with statistics and tabs
  - Members tab - Manage all members, view QR codes
  - Events tab - Create and manage events
  - Projects tab - Create and manage projects
  - Team tab - Team management
  - Attendance tab - Event attendance tracking
  - Messages tab - Announcements and messages
  - Settings tab - Admin settings

## Utility Files

### New Files Created
- `lib/supabase-server.ts` - Server-side Supabase client
- `lib/supabase-browser.ts` - Browser-side Supabase client
- `lib/auth.ts` - Authentication utilities (password hashing, JWT, password reset)
- `lib/auth-middleware.ts` - Middleware for protecting routes
- `lib/generate-user-id.ts` - Updated user ID generator
- `scripts/setup-supabase.sql` - Database schema
- `scripts/setup-database.js` - Database initialization script

### Updated Files
- `lib/generate-user-id.ts` - New NJBS-YYYYMMDDHHMMSS format
- All auth API routes - Converted to Supabase
- All admin API routes - Converted to Supabase
- Admin page - Updated role checking

## Security Notes

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **Password Reset**: Codes expire after 15 minutes
3. **Admin Access**: Protected by JWT middleware
4. **Password Hashing**: Using bcryptjs with salt 10
5. **HTTP-only Cookies**: All authentication tokens are secure

## Testing the Setup

1. **Test Signup**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!@#","fullName":"Test User"}'
   ```

2. **Test Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!@#"}'
   ```

3. **Test Admin Access**:
   - Login as admin user (sangamkunwar48@gmail.com)
   - Navigate to `/admin`
   - Create projects and events from the dashboard

4. **Test Password Reset**:
   - Go to `/auth/forgot-password`
   - Enter your email
   - Get 6-digit code from response (in dev mode)
   - Go to `/auth/reset-password`
   - Enter code and new password

## Troubleshooting

### "Database connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
- Verify Supabase project is active

### "Invalid token" or "Unauthorized"
- Check JWT_SECRET matches between signing and verification
- Token may be expired (7-day expiry)
- Ensure HTTP-only cookies are being sent

### "User not found"
- Clear browser cookies
- Login again to get fresh token

### QR Code not generating
- Check `qrcode` package is installed
- Verify user_id format is correct

## Next Steps (Optional)

1. **Email Integration**: Connect to email service for password reset codes
2. **Event Registration**: Allow members to register for events
3. **Project Membership**: Add members to projects
4. **Dashboard Analytics**: Enhanced statistics and charts
5. **File Uploads**: Add project/event images using Vercel Blob
6. **Export Functionality**: Export member lists and QR codes

## Support

For issues or questions:
1. Check console logs in browser dev tools
2. Check server logs in Vercel
3. Verify Supabase connection in project dashboard
4. Check JWT_SECRET and other environment variables

---
**Last Updated**: April 25, 2026
**Status**: Ready for Production
