# ICT Club Portal - Complete Setup Instructions

## ⚠️ Important: Database Setup Required

The system is ready but needs database tables created. Follow these steps:

---

## Step 1: Get the SQL Code

Copy the following SQL code - this creates the 3 main tables needed:

```sql
-- ============================================
-- SIMPLE DATABASE SETUP FOR ICT CLUB
-- Copy and paste this into Supabase SQL Editor
-- ============================================

-- 1. CREATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  start_date DATE,
  end_date DATE,
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url VARCHAR(500),
  demo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CREATE EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INTEGER DEFAULT 100,
  event_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. CREATE TEAM TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  bio TEXT,
  image_url VARCHAR(500),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES FOR PROJECTS
CREATE POLICY "Allow public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow all for projects" ON projects
  FOR ALL USING (true);

-- 6. CREATE RLS POLICIES FOR EVENTS
CREATE POLICY "Allow public read events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Allow all for events" ON events
  FOR ALL USING (true);

-- 7. CREATE RLS POLICIES FOR TEAM
CREATE POLICY "Allow public read team" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Allow all for team" ON team_members
  FOR ALL USING (true);

-- 8. CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_team_email ON team_members(email);
```

---

## Step 2: Run SQL in Supabase

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Click "SQL Editor"** on the left sidebar
4. **Click "New Query"**
5. **Paste the SQL code above**
6. **Click "Run"** (orange button)
7. **Wait for success message**

---

## Step 3: Login to Admin

1. Go to your site
2. Click "Login" or go to `/auth/login`
3. Enter:
   - **Email**: `sangamkunwar48@gmail.com`
   - **Password**: Your password (the one you created during signup)
4. Click "Login"

---

## Step 4: Access Admin Dashboard

1. Click your **avatar** in top right
2. Select **"Admin Dashboard"**
3. Or go to `/admin`

---

## Step 5: Start Using Features

### Projects Tab
- ✅ Click "+ Add Project"
- ✅ Fill in name, description, dates, tech stack, URLs
- ✅ Click "Create Project"
- ✅ Edit: Click pencil icon
- ✅ Delete: Click trash icon (with confirmation)

### Events Tab
- ✅ Click "+ Add Event"
- ✅ Fill in title, description, date, time, location, capacity
- ✅ Click "Create Event"
- ✅ Edit: Click pencil icon
- ✅ Delete: Click trash icon (with confirmation)

### Team Tab
- ✅ Click "+ Add Member"
- ✅ Fill in name, email, position, department
- ✅ Click "Create Member"
- ✅ Edit: Click pencil icon
- ✅ Delete: Click trash icon (with confirmation)

---

## What Each Table Does

| Table | Purpose | Fields |
|-------|---------|--------|
| **projects** | Manage projects | name, description, status, dates, tech stack, URLs |
| **events** | Schedule events | title, description, date, time, location, capacity, type |
| **team_members** | Manage team | name, email, position, department, bio, phone |

---

## Features

✅ **Create** - Add new items
✅ **Read** - View all items with search
✅ **Update** - Edit items (click pencil)
✅ **Delete** - Remove items (click trash, confirm)
✅ **Search** - Filter by keyword
✅ **Auto Save** - Changes save instantly
✅ **Error Messages** - See what went wrong
✅ **Success Messages** - Know when it worked

---

## Troubleshooting

### "Loading..." stays forever
- SQL script not run yet
- Solution: Follow Step 1-2 above

### "No projects/events/team" appears
- Tables are empty (normal!)
- Solution: Click "Add Project/Event/Member" to create your first one

### Can't see Admin Dashboard link
- Not logged in as admin
- Solution: Login with `sangamkunwar48@gmail.com`

### Edit/Delete buttons not working
- Check browser console for errors (F12)
- Refresh page (Ctrl+R)
- Try again

---

## All Features Working After Setup

Once you run the SQL script, these work:

✅ Projects: Create, read, update, delete
✅ Events: Create, read, update, delete
✅ Team Members: Create, read, update, delete
✅ Search across all sections
✅ Form validation
✅ Auto-save to database
✅ Error handling

---

## Need Help?

1. Check **DATABASE_SETUP.md** - Detailed database guide
2. Check **CRUD_FEATURES.md** - Feature details
3. Refresh the page (Ctrl+F5)
4. Clear browser cache if needed
5. Check browser console (F12 > Console tab)

---

## You're All Set!

After following these steps, everything should work perfectly. The admin dashboard will load, tables will appear, and you can start managing your club! 🎉
