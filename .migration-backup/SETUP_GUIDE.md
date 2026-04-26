# The Salon - Setup Guide

This guide walks you through setting up The Salon portal from scratch.

## Prerequisites

- Supabase account (free tier is fine: https://supabase.com)
- Node.js 18+ and pnpm installed
- Git (optional, for version control)

## Step 1: Clone or Create Project

If you downloaded this as a ZIP:
```bash
unzip salon-portal.zip
cd salon-portal
```

## Step 2: Install Dependencies

```bash
pnpm install
```

## Step 3: Set Up Supabase

### 3a. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the details:
   - Name: "The Salon" (or your choice)
   - Database Password: Create a strong password
   - Region: Choose closest to your location
   - Click "Create new project"

Wait for the project to initialize (2-3 minutes).

### 3b. Get Your Credentials

1. Go to Project Settings > API
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3c. Create .env.local

In your project root, create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Set Up Database Schema

### Method 1: Using Supabase Dashboard (Recommended)

1. In Supabase, go to SQL Editor
2. Click "New query"
3. Copy everything from `scripts/setup-db.sql`
4. Paste into the SQL editor
5. Click "Run"
6. You should see "Success" message

**Optional - Add Sample Data:**
1. Create another SQL query
2. Copy everything from `scripts/seed-data.sql`
3. Run it
4. Now you'll have sample projects and events

### Method 2: Using CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

## Step 5: Configure OAuth (Optional but Recommended)

To enable Google and GitHub login:

### Enable Google OAuth:

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
6. Get your Client ID and Client Secret
7. In Supabase:
   - Go to Authentication > Providers > Google
   - Enable it
   - Paste Client ID and Client Secret
   - Save

### Enable GitHub OAuth:

1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Get your Client ID and Client Secret
5. In Supabase:
   - Go to Authentication > Providers > GitHub
   - Enable it
   - Paste Client ID and Client Secret
   - Save

## Step 6: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Step 7: Test the Application

1. **Homepage**: Check if you see "The Salon" with all sections
2. **Sign Up**: Create a test account using email/password
3. **Team Page**: You should see sample team members (if you ran seed data)
4. **Projects Page**: Browse sample projects
5. **Events Page**: See upcoming events and try registering
6. **Profile Page**: Update your profile information
7. **Contact**: Fill out the contact form

## Step 8: Customize Your Content

### Add Team Members

1. Go to Supabase SQL Editor
2. Run this query:

```sql
INSERT INTO members (display_name, role, bio, avatar_url, github_url, twitter_url, website_url, skills)
VALUES (
  'Your Name',
  'Your Role (e.g., Developer)',
  'A bit about yourself...',
  'https://example.com/avatar.jpg',
  'https://github.com/yourname',
  'https://twitter.com/yourname',
  'https://yourwebsite.com',
  ARRAY['Skill1', 'Skill2', 'Skill3']
);
```

### Add Projects

```sql
INSERT INTO projects (title, description, image_url, status, tech_stack, link)
VALUES (
  'Project Title',
  'Project description...',
  'https://example.com/image.jpg',
  'ongoing',
  ARRAY['Tech1', 'Tech2'],
  'https://project-link.com'
);
```

### Add Events

```sql
INSERT INTO events (title, description, image_url, date, location, type, capacity)
VALUES (
  'Event Name',
  'Event description...',
  'https://example.com/image.jpg',
  NOW() + INTERVAL '7 days',
  'Location or Virtual',
  'meeting',
  50
);
```

## Step 9: Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/salon-portal.git
git push -u origin main
```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables in "Environment Variables":
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click "Deploy"

## Troubleshooting

### "Supabase URL is required"
Make sure your `.env.local` file has the correct Supabase credentials.

### OAuth not working
Check that:
1. Redirect URLs are correctly set in OAuth provider settings
2. Client IDs and secrets are correct
3. OAuth is enabled in Supabase Authentication settings

### Can't see data on pages
1. Check that you ran `scripts/seed-data.sql` or added data manually
2. Verify tables exist in Supabase SQL Editor
3. Check RLS policies aren't blocking your user

### Login page shows errors
This usually means Supabase environment variables aren't set. Double-check `.env.local`.

## Next Steps

Now that your portal is running:

1. **Customize Colors**: Edit design tokens in `app/globals.css`
2. **Add More Features**: Extend the codebase with additional functionality
3. **Promote Your Community**: Share the link with your members
4. **Build Community**: Use the platform to connect your team

## Getting Help

- **Next.js Issues**: https://nextjs.org/docs
- **Supabase Help**: https://supabase.com/docs
- **TailwindCSS**: https://tailwindcss.com/docs

---

Happy building! 🎉
