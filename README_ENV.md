# Environment Variables Setup

To run the quote submission system, email notifications, and admin dashboard securely, configure the following environment variables.

Create a `.env.local` file in the root of your project (or set these in your hosting provider's dashboard like Netlify or Vercel):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ezlhqlohllxhthatlwwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bGhxbG9obGx4aHRoYXRsd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODkwOTUsImV4cCI6MjEwMjE2NTA5NX0.d60hv0hQwT1MpzcCDK-1WSmmSpp6-FM2VU-XChZqV8U
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend Transactional Email API Key
RESEND_API_KEY=re_your_resend_api_key_here

# Business Settings
BUSINESS_EMAIL=info@ngmlandscape.ca

# Admin Credentials
ADMIN_PASSWORD=ngm-admin-2026
```

## Security Warning

Never commit `.env.local` or any actual keys (like `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY`) to Git. The project contains a `.gitignore` configured to ignore `.env.local` and `.env` (ensure it remains ignored).

## Where to find these credentials:

1. **Supabase URL & Anon Key**: Already configured in `.env` for local testing.
2. **Supabase Service Role Key**: Found in your Supabase project settings under **API** -> `service_role` (labeled "secret").
3. **Resend API Key**: Sign up at [Resend](https://resend.com), create an API key, and configure your sender domain.
4. **Admin Password**: Set this to any secret passcode. You will enter this on the `/admin` dashboard page to login.
