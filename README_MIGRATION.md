# 10,000 IDEAS - Next.js Migration

This is the migrated version of 10,000 IDEAS built on the Ship Fast Next.js boilerplate with Supabase.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ship-fast
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Tables

Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy contents from supabase/migrations/001_initial_schema.sql
```

Or use the Supabase CLI:

```bash
npx supabase db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
ship-fast/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes (Supabase integration)
│   │   ├── projects/        # Project endpoints
│   │   ├── backlog/         # Backlog ideas + voting
│   │   ├── join-requests/   # Join project requests
│   │   └── problems/        # Problem submissions
│   ├── page.js              # Homepage (10000ideas UI)
│   ├── layout.js            # Root layout
│   └── globals.css          # Custom beige/orange theme
├── libs/
│   ├── supabase.ts          # Server Supabase client
│   └── supabase-browser.ts  # Browser Supabase client
├── supabase/
│   └── migrations/          # Database schema
├── types/
│   └── database.types.ts    # TypeScript types
└── config.js                # App configuration
```

## 🎨 Design System

- **Colors**: Warm beige (#F5F2EB) background, vibrant orange (#FF4400) primary
- **Fonts**: Space Grotesk (headings), Inter (body)
- **Style**: Swiss-inspired minimalist design with bold borders

## 🗄️ Database Schema

### Tables

- **projects** - Project showcase with phases
- **backlog_ideas** - Community-submitted ideas with voting
- **join_requests** - Interest in joining projects
- **problems** - Problem statements from users

All tables have Row Level Security (RLS) enabled with public read/write access.

## 🔑 Features Included from Ship Fast

- ✅ **Supabase** (PostgreSQL database)
- ✅ **Next.js 15** (App Router)
- ✅ **Tailwind CSS** (Custom theme)
- 🔜 **NextAuth** (Ready for future auth)
- 🔜 **Stripe** (Ready for future payments)
- 🔜 **Resend** (Ready for transactional emails)

## 📝 To-Do

- [ ] Create submission forms (`/submit`, `/submit-problem`)
- [ ] Create project detail page (`/project/[id]`)
- [ ] Create backlog voting page
- [ ] Add sample data to Supabase
- [ ] Set up authentication (optional)
- [ ] Configure Stripe (optional)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Make sure to add your Supabase credentials as environment variables in Vercel.

## 🤝 Contributing

This is an open-source venture studio. Feel free to:
- Submit ideas via the platform
- Join project teams
- Contribute code improvements

---

Built with [Ship Fast](https://shipfa.st) ⚡️
