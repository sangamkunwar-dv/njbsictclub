# ICT Club Portal - Quick Start Guide

## 5-Minute Setup

### 1. Create Supabase Project
1. Go to https://supabase.com and create account
2. Create new project
3. Copy Project URL and Anon Key from Settings > API

### 2. Add Environment Variables
In your Vercel project (Settings > Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Run Database Setup
In Supabase SQL Editor, copy-paste and run:
- `scripts/01-initial-schema.sql`
- `scripts/02-admin-tables.sql`
- `scripts/03-seed-data.sql`

### 4. Create Admin User
Run this SQL in Supabase:
```sql
-- Create user in auth (use Supabase Auth UI or direct insert)
-- Then update the profile:
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'njbsictclub@gmail.com';
```

### 5. Deploy
Push to GitHub and Vercel auto-deploys!

## Test Account Access

After setup:
1. **Sign up** with any email
2. Go to **Profile** to edit avatar and info
3. **Admin** only: Use njbsictclub@gmail.com → Admin Dashboard appears

## Key Pages

- `/` - Home
- `/team` - Members
- `/projects` - Projects
- `/events` - Events
- `/contact` - Contact form
- `/profile` - Your profile (logged in)
- `/admin` - Admin dashboard (admin only)
- `/auth/login` - Login
- `/auth/signup` - Sign up

## Features Overview

### User Features
- Avatar upload and profile editing
- Member ID assignment
- Event registration
- View projects and team
- Contact form submission
- Dark/Light theme toggle

### Admin Features
- Manage members (add, edit, delete, assign roles)
- Create/edit events with capacity and dates
- Manage projects with technologies
- Track attendance with CSV export
- View contact form messages
- Update club settings and colors

## Customization

### Club Name & Email
In Admin > Settings tab, update:
- Club name: ICT Club of NJBS
- Email: njbsictclub@gmail.com
- Description and colors

### Theme Colors
- Primary: #6366f1 (indigo)
- Accent: #8b5cf6 (purple)
- Edit in Admin > Settings

## Troubleshooting

**"Supabase connection failed"**
- Check env variables are set correctly
- Verify URL doesn't have trailing slash
- Check anon key is correct

**"useTheme error during build"**
- Already fixed in code
- If persists, rebuild with `pnpm build`

**"Table not found"**
- Run SQL setup scripts in order
- Verify all 3 scripts executed without error

**Avatar not uploading**
- Check file size < 5MB
- Ensure JPEG/PNG format
- Check browser console for errors

## Database Schema Quick Reference

**user_profiles** - All user data
**projects** - Project listings
**events** - Event details
**event_registrations** - User event signups
**attendance_logs** - Check-in records
**contact_submissions** - Form messages
**club_settings** - Club configuration

## Common Tasks

### Add New Member
Admin > Members > Add Member

### Create Event
Admin > Events > Create Event

### Track Attendance
Admin > Attendance (check-in on event date)

### Export Attendance
Admin > Attendance > Export CSV

### Change Club Colors
Admin > Settings > Pick colors

### Make Someone Admin
Admin > Members > Select user > Change role to Admin

## Support Resources

- Full docs: `IMPLEMENTATION_COMPLETE.md`
- Setup guide: `SETUP_GUIDE.md`
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs

## Next Steps

1. Set up database (if not done)
2. Create admin account
3. Add sample members/events in admin
4. Customize club info in settings
5. Share login link with club members
6. Start tracking attendance

---

You're all set! The portal is ready for use. Visit https://your-domain.com to get started!
