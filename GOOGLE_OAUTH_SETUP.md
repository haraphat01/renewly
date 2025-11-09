# Google OAuth Setup for Clerk (Production)

Yes, you need to set up OAuth credentials in Google Cloud Console to use Google sign-in with Clerk in production.

## Why You Need This

Clerk provides test OAuth credentials for development, but for production you need your own Google OAuth credentials to:
- Have full control over your OAuth app
- Avoid rate limits from shared test credentials
- Ensure security and compliance
- Customize the OAuth consent screen

## Step-by-Step Setup

### Step 1: Create OAuth Credentials in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Name it (e.g., "Dealping")

3. **Enable Google+ API** (if needed)
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** (unless you have a Google Workspace)
   - Fill in required fields:
     - **App name**: Dealping
     - **User support email**: your-email@example.com
     - **Developer contact email**: your-email@example.com
   - Click **Save and Continue**
   - Skip Scopes (unless you need specific ones)
   - Add test users if needed (for testing before verification)
   - Click **Save and Continue**

5. **Create OAuth Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Choose **Web application**
   - Fill in:
     - **Name**: Dealping Web Client
     - **Authorized JavaScript origins**:
       - `https://www.dealping.tech`
       - `https://dealping.tech`
       - `http://localhost:3000` (for local dev)
     - **Authorized redirect URIs**:
       - `https://accounts.clerk.dev/v1/oauth_callback` (for Clerk test)
       - `https://accounts.dealping.tech/v1/oauth_callback` (if using custom domain)
       - `https://clerk.dealping.tech/v1/oauth_callback` (if using custom domain)
       - `http://localhost:3000/v1/oauth_callback` (for local dev)
   - Click **Create**
   - **Copy the Client ID and Client Secret** (you'll need these for Clerk)

### Step 2: Configure Google OAuth in Clerk

1. **Go to Clerk Dashboard**
   - Make sure you're in **Production** mode
   - Go to **User & Authentication** → **Social Connections**

2. **Enable Google**
   - Find **Google** in the list
   - Toggle it **ON**

3. **Add Your Credentials**
   - Click **Configure** on Google
   - Enter:
     - **Client ID**: (from Google Cloud Console)
     - **Client Secret**: (from Google Cloud Console)
   - Click **Save**

### Step 3: Update Redirect URIs (Important!)

After adding credentials in Clerk, you'll get a specific redirect URI. Update Google Cloud Console:

1. **Get Redirect URI from Clerk**
   - In Clerk Dashboard → **Social Connections** → **Google**
   - Look for the redirect URI (it will be something like `https://accounts.clerk.dev/v1/oauth_callback` or `https://accounts.dealping.tech/v1/oauth_callback`)

2. **Update Google Cloud Console**
   - Go back to Google Cloud Console → **Credentials**
   - Click on your OAuth client
   - Add the Clerk redirect URI to **Authorized redirect URIs**
   - Click **Save**

### Step 4: Test

1. **Test in Development**
   - Use test credentials first
   - Try signing in with Google on `localhost:3000`

2. **Test in Production**
   - Deploy with production keys
   - Try signing in with Google on your production site

## Important Notes

### Redirect URI Format

The redirect URI format depends on whether you're using:
- **Clerk's default domain**: `https://accounts.clerk.dev/v1/oauth_callback`
- **Custom domain**: `https://accounts.dealping.tech/v1/oauth_callback` or `https://clerk.dealping.tech/v1/oauth_callback`

Check your Clerk Dashboard to see the exact redirect URI you need to use.

### OAuth Consent Screen Verification

- For **internal use** (your team only): No verification needed
- For **public use**: Google requires verification if you request sensitive scopes
- For basic sign-in (email, profile): Usually no verification needed

### Multiple Environments

You can use the same OAuth credentials for:
- Development (localhost)
- Staging
- Production

Just make sure all redirect URIs are added to Google Cloud Console.

## Troubleshooting

### "Redirect URI mismatch" error
- Check that the redirect URI in Google Cloud Console matches exactly what Clerk provides
- Make sure you're using the correct domain (custom vs default)

### "Access blocked" error
- Check OAuth consent screen configuration
- Make sure your app is not in restricted mode
- Add test users if your app is in testing mode

### Sign-in not working
- Verify Client ID and Client Secret are correct in Clerk
- Check that Google+ API is enabled
- Verify redirect URIs match exactly

## Quick Checklist

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Added authorized JavaScript origins
- [ ] Added authorized redirect URIs (including Clerk's)
- [ ] Enabled Google in Clerk Dashboard
- [ ] Added Client ID and Client Secret to Clerk
- [ ] Updated redirect URIs in Google Cloud after getting Clerk's URI
- [ ] Tested sign-in in development
- [ ] Tested sign-in in production

## Alternative: Use Clerk's Test Credentials (Development Only)

For development/testing, Clerk provides test OAuth credentials. However, these:
- Have rate limits
- May not work reliably in production
- Should NOT be used for production apps

Always set up your own OAuth credentials for production!

