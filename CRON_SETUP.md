# CRON_SECRET Setup Guide

The `CRON_SECRET` is used to secure your reminder endpoint (`/api/reminders/send`) so only authorized cron jobs can trigger it.

## Step 1: Generate a Secure Secret

I've generated a secure random secret for you:

```
ZHQO4Own5GD/hgOEiQUimGrfXktQX1dv7d8sL1RwxQc=
```

**Or generate your own:**
```bash
openssl rand -base64 32
```

## Step 2: Add to Local Environment

Add the secret to your `.env.local` file:

```env
CRON_SECRET=ZHQO4Own5GD/hgOEiQUimGrfXktQX1dv7d8sL1RwxQc=
```

## Step 3: Add to Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: `ZHQO4Own5GD/hgOEiQUimGrfXktQX1dv7d8sL1RwxQc=` (or your generated secret)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application for the changes to take effect

## Step 4: Set Up Vercel Cron Job

If you're using Vercel, the `vercel.json` file has been created with the cron job configuration. The cron job will automatically:
- Call `/api/reminders/send` daily at 9:00 AM UTC
- Include the `Authorization: Bearer CRON_SECRET` header

**Schedule**: `0 9 * * *` (9:00 AM UTC daily)

To change the schedule, edit `vercel.json`:
- `0 9 * * *` = Daily at 9:00 AM UTC
- `0 */6 * * *` = Every 6 hours
- `*/30 * * * *` = Every 30 minutes

## Step 5: Test the Endpoint

You can test the endpoint manually:

```bash
curl -X POST http://localhost:3000/api/reminders/send \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or in production:

```bash
curl -X POST https://your-app.vercel.app/api/reminders/send \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Alternative: External Cron Service

If you're not using Vercel, you can use external cron services:

### Option 1: cron-job.org
1. Sign up at https://cron-job.org
2. Create a new cron job
3. Set the URL: `https://your-app.vercel.app/api/reminders/send`
4. Method: `POST`
5. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
6. Set schedule (e.g., daily at 9 AM)

### Option 2: EasyCron
1. Sign up at https://www.easycron.com
2. Create a new cron job
3. Set URL and authentication header
4. Configure schedule

### Option 3: GitHub Actions
See `SETUP.md` for GitHub Actions configuration example.

## Security Notes

- **Never commit** `CRON_SECRET` to version control
- Use different secrets for development and production
- Keep your secret secure and rotate it periodically
- The endpoint will return `401 Unauthorized` if the secret doesn't match

## Troubleshooting

**Error: "Unauthorized"**
- Check that `CRON_SECRET` is set in your environment variables
- Verify the secret matches in both your app and cron service
- Make sure you're using `Bearer ` prefix in the Authorization header

**Cron job not running**
- Check Vercel logs for cron job execution
- Verify `vercel.json` is in the root directory
- Ensure the cron job is enabled in Vercel dashboard

