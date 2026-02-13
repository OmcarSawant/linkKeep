# Supabase Setup Guide

Follow these steps to configure your Supabase project for the Smart Bookmark App.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Once created, go to **Project Settings > API**.
3. Copy the **Project URL** and **anon public key**.
4. Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 2. Database Schema

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL query to create the table and security policies:

```sql
-- Create the bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- Create Policy: Users can only see their own bookmarks
create policy "Users can view own bookmarks" 
on public.bookmarks for select 
using (auth.uid() = user_id);

-- Create Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks" 
on public.bookmarks for insert 
with check (auth.uid() = user_id);

-- Create Policy: Users can update their own bookmarks
create policy "Users can update own bookmarks" 
on public.bookmarks for update 
using (auth.uid() = user_id);

-- Create Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks" 
on public.bookmarks for delete 
using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table public.bookmarks;
```

## 3. Google OAuth Configuration

1. Go to **Authentication > Providers** in Supabase.
2. Enable **Google**.
3. You will need a **Client ID** and **Client Secret** from Google Cloud Console.
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.
   - Go to **APIs & Services > OAuth consent screen**. Connect it to your domain (or external for testing).
   - Go to **APIs & Services > Credentials**.
   - Create **OAuth Client ID** (Web application).
   - Add **Authorized redirect URIs**:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Secret back to Supabase.
5. Save changes in Supabase.

## 4. URL Configuration

1. In Supabase, go to **Authentication > URL Configuration**.
2. Set **Site URL** to `http://localhost:3000` (for local development).
3. If deploying to Vercel, add your Vercel URL to **Redirect URLs**.

You're all set! Restart your Next.js server if it's running.
