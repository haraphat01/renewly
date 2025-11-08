# Dealping Setup Guide

This guide will walk you through setting up Dealping from scratch.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18+** installed
2. Accounts for:
   - [Supabase](https://supabase.com) (free tier works)
   - [Clerk](https://clerk.com) (free tier works)
   - [OpenAI](https://openai.com) (API key required)
   - [Resend](https://resend.com) (for email notifications)

## Step-by-Step Setup

### 1. Clone and Install

```bash
cd Dealping
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to SQL Editor and run the migration:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and execute in the SQL Editor
4. Create a storage bucket:
   - Go to Storage → Create Bucket
   - Name: `contracts`
   - **Important**: You can keep RLS enabled - the app uses the service role key for uploads
   - Make it public if you want direct access to files, or keep it private (files are accessed via signed URLs)
5. Get your credentials:
   - Go to Settings → API
   - Copy the Project URL, anon/public key, and **service_role key** (keep this secret!)

### 3. Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Configure authentication methods (Email is recommended)
4. Get your credentials:
   - Go to API Keys
   - Copy the Publishable Key and Secret Key
5. Configure allowed origins:
   - Add `http://localhost:3000` for development
   - Add your production URL when deploying

### 4. Get API Keys

1. **OpenAI**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an API key
   - Make sure you have credits

2. **Resend**:
   - Go to [resend.com](https://resend.com)
   - Sign up and verify your domain (or use their test domain)
   - Create an API key

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (optional, for admin operations)

# OpenAI
OPENAI_API_KEY=sk-...

# Resend
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Secret (for reminder endpoint)
CRON_SECRET=your-random-secret-here
```

### 6. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you should see the landing page!

### 7. Set Up Reminders (Optional)

To enable automated email reminders, you need to set up a cron job that calls:

```
POST /api/reminders/send
Authorization: Bearer YOUR_CRON_SECRET
```

**Options:**

1. **Vercel Cron Jobs** (if deploying to Vercel):
   Create `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/reminders/send",
       "schedule": "0 9 * * *"
     }]
   }
   ```

2. **GitHub Actions**:
   Create `.github/workflows/reminders.yml`:
   ```yaml
   name: Send Reminders
   on:
     schedule:
       - cron: '0 9 * * *'
   jobs:
     send:
       runs-on: ubuntu-latest
       steps:
         - name: Send reminders
           run: |
             curl -X POST https://your-app.vercel.app/api/reminders/send \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
   ```

3. **External Cron Service**:
   Use services like cron-job.org or EasyCron to call the endpoint daily.

## Testing the Application

1. **Sign Up**: Create an account using the sign-up page
2. **Upload a Contract**: 
   - Go to Dashboard → New Contract
   - Upload a PDF or DOCX file
   - The AI should extract contract details automatically
3. **View Dashboard**: Check that your contract appears
4. **Test Reminders**: Manually trigger the reminder endpoint to test emails

## Troubleshooting

### "Failed to extract contract data"
- Check your OpenAI API key is correct
- Ensure you have credits in your OpenAI account
- Check the file format (PDF or DOCX only)

### "Failed to upload file"
- Verify Supabase storage bucket is created
- Check bucket permissions
- Ensure file size is under 10MB

### "Unauthorized" errors
- Verify Clerk credentials are correct
- Check that your domain is added to Clerk's allowed origins
- Clear browser cookies and try again

### Database connection issues
- Verify Supabase URL and keys are correct
- Check that the migration was run successfully
- Ensure your Supabase project is active

## Next Steps

- Customize the branding and colors
- Add SMS notifications (requires Twilio setup)
- Implement Stripe for subscription payments
- Add more contract templates
- Set up analytics tracking

## Support

If you encounter issues, check:
1. All environment variables are set correctly
2. All services (Supabase, Clerk, OpenAI) are active
3. Browser console for errors
4. Server logs for API errors

For more help, open an issue on GitHub or contact support@Dealping.app

