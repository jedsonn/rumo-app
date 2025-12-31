# Rumo - Goal Tracking App

**Rumo** means "direction" in Portuguese. This is a premium goal-tracking web application that helps users manage personal and professional goals across multiple time horizons.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Supabase** - PostgreSQL database + Authentication
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **Canvas Confetti** - Celebrations

## Features

- **Goal Tracking** - Personal and professional goals with status (Doing, On Track, For Later, Done, Dropped)
- **Time Horizons** - 1-year, 3-year, and 5-year goals
- **Blessings** - Gratitude tracker
- **Rewards** - Earn rewards for completing goals
- **Dark Mode** - Toggle between light and dark themes
- **Theme Colors** - Blue or Pink accent colors
- **Responsive** - Works on desktop and mobile
- **Real-time Sync** - Data syncs across devices

## Getting Started

### 1. Clone and Install

```bash
cd rumo-app
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the schema from `supabase/migrations/001_initial_schema.sql`
4. Go to **Settings > API** and copy your project URL and anon key

### 3. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Go to **APIs & Services > Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret
7. In Supabase Dashboard, go to **Authentication > Providers > Google**
8. Enable Google and paste your credentials

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/rumo-app.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
4. Deploy!

### 3. Update Auth Redirect URLs

After deploying, update these in Supabase:

1. **Authentication > URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/auth/callback`

2. **Google OAuth** (if using):
   - Add `https://your-app.vercel.app` to authorized origins
   - Add `https://YOUR-PROJECT.supabase.co/auth/v1/callback` to redirect URIs

## Project Structure

```
rumo-app/
├── app/
│   ├── auth/              # Auth pages (login, signup, callback)
│   ├── dashboard/         # Main app pages
│   │   ├── blessings/     # Blessings page
│   │   ├── rewards/       # Rewards page
│   │   ├── layout.tsx     # Dashboard layout with auth
│   │   └── page.tsx       # Goals page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── auth/              # Auth components
│   ├── blessings/         # Blessing components
│   ├── goals/             # Goal components
│   ├── providers/         # Context providers
│   ├── rewards/           # Reward components
│   └── ui/                # Shared UI components
├── lib/
│   ├── supabase/          # Supabase client utilities
│   └── types.ts           # TypeScript types
├── supabase/
│   └── migrations/        # Database schema
└── public/                # Static assets
```

## Database Schema

- **profiles** - User settings (theme, dark mode, column split)
- **goals** - Goals with status, period, category, etc.
- **blessings** - Gratitude entries
- **rewards** - Rewards with earned status

All tables have Row Level Security (RLS) enabled so users can only access their own data.

## License

MIT
