# Smart Bookmark App

A modern, full-stack bookmark manager built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Login**: Secure authentication with Supabase Auth.
- **Real-time Updates**: Bookmarks sync instantly across devices and tabs using Supabase Realtime.
- **Private Bookmarks**: Row Level Security (RLS) ensures users only see their own data.
- **Premium UI**: Beautiful, responsive interface with Tailwind CSS and glassmorphism design.
- **Production Ready**: Optimized for Vercel deployment.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### Installation

1. **Clone the repository** (or use the provided files):
   ```bash
   git clone <repository-url>
   cd smart-bookmark-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials in `.env.local`.

4. **Configure Supabase**:
   Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to set up your database schema and authentication.

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

To deploy on Vercel:

1. Push your code to a Git repository.
2. Import the project into Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4. Deploy!

## Problems Encountered and Solutions

### 1. Tailwind CSS "Unknown At-Rule" Warnings
- **Problem**: VS Code's default CSS validator did not recognize Tailwind's `@tailwind` directives, cluttering the editor with warnings.
- **Solution**: Created a `.vscode/settings.json` file to configure `css.lint.unknownAtRules` to `"ignore"`.

### 2. Next.js Client vs Server Component Errors
- **Problem**: Several components using React hooks (`useState`, `useEffect`) were initially created as Server Components by default, causing runtime crashes.
- **Solution**: Added the `"use client"` directive to the top of `Header.tsx`, `BookmarkList.tsx`, and `BookmarkForm.tsx` to ensure they execute on the client side.

### 3. Event Propagation in Bookmark Cards
- **Problem**: Since the entire bookmark card was wrapped in an `<a>` tag for accessibility/ease of use, clicking the "Delete" button inside the card would also trigger the link and open the website.
- **Solution**: Added `e.stopPropagation()` and `e.preventDefault()` to the delete button's click handler to isolate the deletion action from the navigation.

### 4. Dynamic OAuth Profile Metadata
- **Problem**: The dashboard initially showed hardcoded user names and avatars. I needed to fetch this data from the Google OAuth provider via Supabase.
- **Solution**: Updated the `Header` component to fetch `user_metadata` from the authenticated user object, extracting the `full_name` and `avatar_url` dynamically with fallback initials.

### 5. Real-time Synchronization
- **Problem**: ensuring that adding a bookmark in one tab would appear in another without a manual refresh.
- **Solution**: Implemented Supabase Realtime via a `channel` subscription in `BookmarkList.tsx`, handling `INSERT` and `DELETE` events to update the local state instantly.

## License

MIT
