# Quick Start Guide - Contact Messages & Admin Replies

## 🚀 Get Started in 5 Minutes

### 1. Set Up Environment Variables

Create `.env.local` in project root:

```env
# Database (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/njbsictclub

# Auth (REQUIRED)
JWT_SECRET=change_me_to_random_secret

# Email Service (pick ONE)
# Option A: Resend (Recommended - easiest)
RESEND_API_KEY=re_your_api_key_here

# Option B: SendGrid
# SENDGRID_API_KEY=SG.your_api_key_here

# Email settings
EMAIL_FROM=noreply@njbsictclub.com
ADMIN_EMAIL=admin@njbsictclub.com
```

### 2. Get Email Service API Key

**Choose Option A or B:**

#### Option A: Resend (Recommended) ⭐
```
1. Go to https://resend.com
2. Click "Sign Up" (free tier)
3. Verify your email
4. Go to "API Keys"
5. Copy the key starting with "re_"
6. Add to .env.local as RESEND_API_KEY
```

#### Option B: SendGrid
```
1. Go to https://sendgrid.com
2. Create account
3. Go to Settings → API Keys
4. Create API Key with "Mail Send" permission
5. Copy key starting with "SG."
6. Verify your sender email address
7. Add to .env.local as SENDGRID_API_KEY
```

### 3. Test Locally

```bash
npm run dev

# Open browser:
# http://localhost:3000/contact → Submit test message
# http://localhost:3000/admin → View as admin (if admin role)
```

### 4. Deploy to Vercel

```bash
# Commit your changes
git add -A
git commit -m "Add contact messages system"
git push origin main

# Vercel auto-deploys!

# Then add environment variables:
# 1. Go to Vercel Dashboard
# 2. Select your project
# 3. Settings → Environment Variables
# 4. Add all variables from .env.local
# 5. Click "Save and Redeploy"
```

### 5. Test in Production

```
Visit: https://your-domain.com/contact
→ Submit test message
→ Check admin panel for message
→ Send reply
→ User receives email
```

---

## 📧 Email Service Setup Details

### Resend (Free Tier)
- 100 emails/day (plenty for a club)
- Easiest for Vercel
- No SMTP configuration needed
- [Get API Key](https://resend.com)

### SendGrid (Free Tier)
- 100 emails/day
- More features available
- Industry standard
- [Get API Key](https://sendgrid.com)

---

## 💾 Get MongoDB

If you don't have MongoDB:

```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Create database user
5. Get connection string
6. Add to MONGODB_URI in .env.local
```

[Detailed MongoDB Setup](./CONTACT_MESSAGES_SETUP.md)

---

## 🔑 Environment Variables Explained

```env
# MONGODB_URI
# Your database connection string
# Format: mongodb+srv://user:password@cluster.mongodb.net/dbname
# Get from: MongoDB Atlas dashboard

# JWT_SECRET
# Secret key for authentication tokens
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# RESEND_API_KEY or SENDGRID_API_KEY
# Email service API key (choose one)
# Resend: starts with "re_"
# SendGrid: starts with "SG."

# EMAIL_FROM
# Email address shown as sender
# Can be: noreply@yourdomain.com

# ADMIN_EMAIL
# Email for admin notifications (optional)
```

---

## 🧪 Testing the System

### Test 1: Submit Contact Message
```
1. Go to /contact
2. Fill form (all fields required):
   - Name: "John Doe"
   - Email: "john@example.com"
   - Subject: "Test Message"
   - Message: "This is a test"
3. Click Submit
4. Should see "Thank you" message
```

### Test 2: View in Admin Dashboard
```
1. Log in as admin user
2. Go to /admin
3. Click "Messages" tab
4. Should see your test message
5. Status should be "new" (red badge)
```

### Test 3: Send Reply
```
1. Click message to select it
2. Message marked as "read" (yellow badge)
3. Scroll to reply section
4. Type reply: "Thanks for contacting us!"
5. Click "Send Reply"
6. Should see "Reply sent successfully"
7. Check email for received reply
```

---

## ❌ Common Issues

### Issue: "MONGODB_URI is not defined"
**Fix:** Add MONGODB_URI to .env.local

### Issue: Email not sending
**Check:**
1. API key is correct (no typos)
2. For Resend: email is verified
3. For SendGrid: sender email is verified
4. Check spam folder

### Issue: Can't see Messages tab
**Check:**
1. Logged in as admin user
2. User has `role: 'admin'` in database
3. Try logging out and back in

### Issue: Vercel build fails
**Check:**
1. All required env vars are set in Vercel
2. Run `npm run build` locally to test
3. Check build logs in Vercel dashboard

[Full Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## 📁 Key Files

```
/api/contact/route.ts           → Receives messages from form
/api/admin/messages/            → Admin API endpoints
/components/admin/messages.tsx  → Admin dashboard UI
/models/Message.ts              → Database schema
.env.example                    → Copy to .env.local
CONTACT_MESSAGES_SETUP.md       → Detailed setup guide
TROUBLESHOOTING.md              → Common issues
```

---

## ✅ Deployment Checklist

- [ ] Created .env.local with all required variables
- [ ] Tested locally with `npm run dev`
- [ ] Submitted test message on /contact
- [ ] Viewed message in admin panel
- [ ] Sent reply and received email
- [ ] Ran `npm run build` successfully
- [ ] Pushed to GitHub
- [ ] Added environment variables to Vercel
- [ ] Tested in production

---

## 🎉 You're Done!

Your contact messages system is ready to use:

✅ Users can submit messages
✅ Admins can view in dashboard
✅ Admins can reply via email
✅ Emails sent automatically
✅ Status tracking (new/read/replied)

**Next steps:**
- Monitor messages in admin panel
- Respond to user inquiries
- Monitor email service usage

---

## 📖 Need More Help?

- [Full Setup Guide](./CONTACT_MESSAGES_SETUP.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Features Overview](./FEATURES_IMPLEMENTED.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Questions?** Check the documentation files above or review the error messages in browser console/Vercel logs.
