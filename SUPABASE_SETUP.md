# Supabase Google OAuth Setup Guide

## Prerequisites

1. A Supabase account at [supabase.com](https://supabase.com)
2. A Google Cloud Console project at [console.cloud.google.com](https://console.cloud.google.com)

## Step 1: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers** > **Google**
3. Enable the Google provider
4. Copy the **Client ID** and **Client Secret** from Google Cloud Console (Step 2 below)
5. Configure the **Site URL**: `http://localhost:3000` (for development) or your production domain
6. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)

## Step 2: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add your authorized origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)
7. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
8. Click **Create** and copy the **Client ID** and **Client Secret**

## Step 3: Configure Scopes

In Google Cloud Console:

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Make sure these scopes are enabled:
   - `openid`
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`

## Step 4: Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in Supabase Dashboard > **Settings** > **API**

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Click the **Login** button in the navigation
3. Click **Continue with Google**
4. Complete the Google sign-in flow
5. You should be redirected back to your app and logged in

## Troubleshooting

### "redirect_uri_mismatch" error

- Make sure the redirect URI in Google Cloud Console matches: `https://your-project.supabase.co/auth/v1/callback`
- Add `http://localhost:3000/auth/callback` for local development

### "Invalid Client ID" error

- Double-check that the Client ID in Supabase matches exactly with Google Cloud Console
- Make sure you're using the correct OAuth client (Web application type)

### "Requested resource not granted" error

- Make sure the Google provider is enabled in Supabase
- Check that your Supabase project has authentication configured correctly

## Production Deployment

When deploying to production:

1. Update Google Cloud Console with your production domain
2. Add production redirect URI: `https://your-domain.com/auth/callback`
3. Update `.env.local` with production URLs
4. Consider setting up a custom domain for your Supabase project

## Security Notes

- Never expose your Supabase Service Role key to the client
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to use client-side
- Use Row Level Security (RLS) policies in Supabase to protect your data
