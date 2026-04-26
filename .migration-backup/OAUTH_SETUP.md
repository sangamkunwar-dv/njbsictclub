# OAuth Authentication & QR Code Setup Guide

## Overview
Your application now has complete OAuth authentication with Google and GitHub, plus QR code generation for user profiles that helps with attendance tracking and event management.

## Features Implemented

### 1. OAuth Authentication
- **Google Login/Signup** - With official Google logo
- **GitHub Login/Signup** - With official GitHub logo
- **Email/Password Authentication** - Traditional signup still works
- **User Detection** - Automatically determines if user exists or creates new account

### 2. QR Code Generation
- **Automatic QR Code** - Generated when users sign up (any method)
- **User Identification** - QR code encodes user ID for attendance tracking
- **Profile Display** - Shows in user profile page
- **Download Feature** - Users can download their QR code as PNG
- **Copy to Clipboard** - Quick copy functionality for sharing

### 3. Updated Pages
- **/auth/login** - Login with Google, GitHub, or Email
- **/auth/signup** - Signup with Google, GitHub, or Email
- **/profile** - Edit profile, view QR code, download QR, logout

## Environment Variables Required

Make sure these are set in Vercel (Settings → Environment Variables):

```
MONGODB_URI                   // MongoDB connection string
JWT_SECRET                    // Secret for JWT tokens

GOOGLE_CLIENT_ID              // From Google Cloud Console
GOOGLE_CLIENT_SECRET          // From Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID  // Same as GOOGLE_CLIENT_ID (public)

GITHUB_CLIENT_ID              // From GitHub Developer Settings
GITHUB_CLIENT_SECRET          // From GitHub Developer Settings
NEXT_PUBLIC_GITHUB_CLIENT_ID  // Same as GITHUB_CLIENT_ID (public)

NEXTAUTH_URL                  // Your app URL (e.g., https://yourapp.vercel.app)
```

## Google OAuth Setup

### 1. Create Google Cloud Project
- Go to https://console.cloud.google.com/
- Create a new project
- Enable Google+ API

### 2. Create OAuth Credentials
- Go to Credentials → Create Credentials → OAuth 2.0 Client ID
- Choose "Web application"
- Add Authorized JavaScript origins:
  - http://localhost:3000 (for local development)
  - https://your-domain.com (for production)
- Add Authorized redirect URIs:
  - http://localhost:3000/api/auth/callback/google
  - https://your-domain.com/api/auth/callback/google

### 3. Copy Credentials
- Copy Client ID and Client Secret
- Add to Vercel environment variables

## GitHub OAuth Setup

### 1. Create GitHub OAuth App
- Go to https://github.com/settings/developers
- Click "New OAuth App"
- Fill in application details

### 2. Configure OAuth App
- Authorization callback URL:
  - http://localhost:3000/api/auth/callback/github (dev)
  - https://your-domain.com/api/auth/callback/github (prod)

### 3. Copy Credentials
- Copy Client ID and Client Secret
- Add to Vercel environment variables

## Database Schema (Updated User Model)

```javascript
{
  email: String (unique),
  password: String (optional for OAuth users),
  full_name: String,
  role: String ('member' | 'organizer' | 'admin'),
  
  // OAuth Fields
  oauthProvider: String ('email' | 'google' | 'github'),
  googleId: String (unique, sparse),
  githubId: String (unique, sparse),
  avatar: String (URL),
  
  // QR Code
  qrCode: String (Base64 encoded image),
  userId: String (unique - used in QR code),
  
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### OAuth Callbacks
- `POST /api/auth/callback/google` - Handles Google OAuth
- `POST /api/auth/callback/github` - Handles GitHub OAuth

### User Authentication
- `POST /api/auth/signup` - Create user with email
- `POST /api/auth/login` - Login with email
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

## How It Works

### 1. User Signs Up with Google/GitHub
- User clicks "Login with Google/GitHub"
- Redirected to OAuth provider
- After approval, redirected to callback route
- System creates user with OAuth provider info
- QR code is automatically generated
- User redirected to profile page

### 2. QR Code Generation
- When user account is created (any method)
- A unique userId is generated
- QR code is created encoding: `{userId}`
- Stored as Base64 image in database
- Can be used for attendance scanning

### 3. User Profile Access
- Users can view their profile at `/profile`
- See their QR code
- Download QR code as PNG
- Copy QR code to clipboard
- Edit profile information
- Logout

## Attendance Integration

The QR codes can be used for attendance tracking:

1. **Admin Dashboard** - Can scan QR codes during events
2. **Mobile App** - Can scan to mark attendance
3. **Check-in System** - Uses embedded userId from QR code

To integrate with attendance:
```javascript
// Scan QR code to get userId
const userId = scannedQRCodeData; // Contains user ID

// Mark attendance
POST /api/admin/attendance
Body: { userId, eventId }
```

## Troubleshooting

### "Google/GitHub button not working"
- Check if NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GITHUB_CLIENT_ID are set
- Verify callback URLs are correct in Google/GitHub console
- Check browser console for errors

### "User not created after OAuth"
- Check MongoDB connection (MONGODB_URI)
- Check server logs for database errors
- Verify email is returned from OAuth provider

### "QR code not showing"
- Ensure qrcode package is installed (`npm install qrcode`)
- Check if qrCode field exists in MongoDB
- Refresh profile page

## Testing

### Local Development
```bash
# Start dev server
npm run dev

# Test endpoints
curl http://localhost:3000/auth/login
curl http://localhost:3000/auth/signup
curl http://localhost:3000/profile
```

### Test Flow
1. Go to http://localhost:3000/auth/signup
2. Click "Google" or "GitHub"
3. Complete OAuth flow
4. Should be redirected to /profile
5. Should see QR code
6. Can download or copy QR code

## Security Notes

- QR codes contain only user ID, not sensitive data
- JWT tokens stored in HTTP-only cookies
- OAuth tokens are server-side only
- All API routes check authentication
- Password hashing with bcryptjs

---

For questions or issues, check the browser console and server logs for detailed error messages.
