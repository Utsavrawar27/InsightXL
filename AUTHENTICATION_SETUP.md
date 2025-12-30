# Authentication Setup Guide

## Current Status: Development Mode

The application is currently running in **DEVELOPMENT MODE** with mocked authentication. This allows you to test the app without setting up Supabase immediately.

### 🔓 Development Mode Features

- **No Supabase Required**: You can login with any email/password
- **Data Stored Locally**: User sessions are saved in browser localStorage
- **Perfect for Testing**: Try out all features without backend setup
- **Easy Access**: Any credentials will work (e.g., `test@example.com` / `password`)

### ⚠️ Development Mode Limitations

- No real authentication security
- Data is not persisted to a database
- Google OAuth is disabled
- Sessions are lost when localStorage is cleared

---

## 🚀 Setting Up Real Authentication (Supabase)

To enable production-ready authentication with Supabase:

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: InsightXL (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Wait for the project to be created (~2 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Create Frontend Environment File

1. Create a file named `.env` in the `frontend/` directory:

```bash
cd frontend
# On Windows:
copy NUL .env
# On Mac/Linux:
touch .env
```

2. Add your Supabase credentials to `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key-here
```

3. **Important**: Replace the placeholder values with your actual credentials!

### Step 4: Create Backend Environment File

1. Open `backend/.env` (should already exist)
2. Add these Supabase credentials:

```env
# Existing OpenAI key
OPENAI_API_KEY=your-openai-key

# Add these Supabase credentials:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
```

> **Note**: The `SUPABASE_SERVICE_ROLE_KEY` is found in the same API settings page, but keep it secret - it has admin privileges!

### Step 5: Set Up Database Schema

Run this SQL in your Supabase SQL Editor (**Database** → **SQL Editor**):

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "System can insert profiles"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Create trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 6: Restart Both Servers

```bash
# Stop both servers (Ctrl+C)

# Restart backend
cd backend
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
uvicorn main:app --reload --port 8000

# Restart frontend (in a new terminal)
cd frontend
npm run dev
```

### Step 7: Test Real Authentication

1. Open http://localhost:5173
2. Click "Start Free" or "Try InsightXL"
3. Click "Login/Register"
4. Create a new account with your email and password
5. Check your email for verification (if enabled in Supabase)
6. Log in!

---

## 🔧 Troubleshooting

### "Error: Invalid API key or URL"

- Check that your `.env` files have the correct values
- Make sure to restart both servers after creating `.env` files
- Verify the values in Supabase dashboard

### "User registration failed"

- Check the SQL schema was created correctly
- Verify Row Level Security policies are enabled
- Check Supabase logs for errors

### "Email verification required"

- In Supabase dashboard, go to **Authentication** → **Settings**
- Under "Email Auth", you can disable email confirmation for development
- Or check your email inbox for the verification link

### Console shows "Running in DEVELOPMENT MODE"

- This means `.env` files are missing or have empty values
- Create the `.env` files as described above
- Restart the servers

---

## 📝 Notes

### Development vs Production Mode

The app automatically detects if Supabase is configured:
- **No `.env`** or **empty values** → Development Mode (mocked auth)
- **Valid Supabase credentials** → Production Mode (real auth)

### Security Best Practices

1. **Never commit `.env` files** to Git (they're in `.gitignore`)
2. **Keep service role key secret** - it has full database access
3. **Enable email verification** in production
4. **Set up proper RLS policies** for all tables

### Google OAuth (Optional)

To enable Google login:
1. In Supabase: **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL to: `http://localhost:5173/auth/callback`

---

## ✅ Success!

Once configured, you'll have:
- ✅ Secure user authentication
- ✅ Persistent user profiles
- ✅ Session management
- ✅ Password recovery
- ✅ Email verification (optional)
- ✅ Google OAuth (optional)

For more help, see: [Supabase Documentation](https://supabase.com/docs/guides/auth)



