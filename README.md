# 💰 Finova - Smart Money Management Platform

A modern, beautiful, and feature-rich money management application built with Next.js 14, TypeScript, and PostgreSQL.

## ✨ Features

- 📊 **Smart Analytics** - Beautiful charts and insights into your spending patterns
- 💳 **Multiple Accounts** - Manage all your bank accounts, credit cards, and investments
- 🎯 **Budget Tracking** - Set budgets and get alerts when approaching limits
- 🔔 **Smart Alerts** - Notifications for unusual spending and bill reminders
- 🏆 **Financial Goals** - Track progress towards your savings goals
- 🔒 **Bank-Level Security** - Industry-standard encryption and security

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with CSS Modules
- **State Management**: React Context + SWR
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend (Supabase - Recommended ✅)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for receipts)
- **Real-time**: Supabase Real-time
- **ORM**: Prisma (for type-safe queries)

**Why Supabase?** It replaces PostgreSQL + NextAuth + S3 + Redis with one service!
See `SUPABASE_VS_TRADITIONAL.md` for detailed comparison.

## 📦 Installation

### Option 1: Quick Start (UI Only - No Database)

Just want to see the beautiful UI? Run this:

```bash
cd /Users/vladimirv/Desktop/Finova/finova-app
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - all pages work with mock data!

### Option 2: Full Setup (With Supabase Backend) ✅

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Save your database password!

3. **Get Supabase credentials**
   - Project Settings → API
   - Copy `Project URL` and `anon/public key`
   - Project Settings → Database → Connection String
   - Copy the URI connection string

4. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

5. **Run Prisma migrations**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Enable Row Level Security**
   - See `SUPABASE_SETUP.md` for detailed RLS setup

7. **Start the app**
   ```bash
   npm run dev
   ```

**📖 Detailed Guide:** See `SUPABASE_SETUP.md` for complete setup instructions!

## 🗂️ Project Structure

```
finova-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Input/
│   │   └── features/           # Feature components
│   │
│   ├── lib/                    # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Helper functions
│   │
│   ├── types/                  # TypeScript types
│   │   ├── transaction.ts
│   │   ├── account.ts
│   │   └── budget.ts
│   │
│   └── styles/                 # Global styles
│       ├── globals.css
│       └── variables.css
│
├── prisma/
│   └── schema.prisma          # Database schema
│
└── public/                    # Static assets
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Palette**: Premium purple/blue gradients with semantic colors
- **Typography**: Inter font family with responsive sizing
- **Spacing**: Consistent spacing scale (4px base unit)
- **Shadows**: Multiple shadow levels for depth
- **Animations**: Smooth transitions and micro-interactions
- **Dark Mode**: Full dark theme support (coming soon)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

### Database Management

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |

## 🚦 Getting Started (Quick)

If you just want to see the UI without setting up a database:

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Visit [http://localhost:3000](http://localhost:3000)

The landing page and dashboard will work with mock data!

## 🎯 Roadmap

- [x] Landing page
- [x] Dashboard UI
- [x] Design system
- [ ] Authentication
- [ ] Transaction management
- [ ] Account management
- [ ] Budget tracking
- [ ] Reports and analytics
- [ ] Dark mode
- [ ] Mobile app
- [ ] Browser extension

## 📄 License

MIT License - feel free to use this project for learning or building your own money management app!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, TypeScript, and PostgreSQL
