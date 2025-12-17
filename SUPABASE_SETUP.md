# 🚀 Finova - Full Supabase Setup Guide

## ✅ What Changed

**Removed:**
- ❌ Prisma
- ❌ Prisma Client
- ❌ `prisma/` directory
- ❌ Database connection strings

**Added:**
- ✅ Pure Supabase client
- ✅ SQL schema file (`supabase/schema.sql`)
- ✅ TypeScript database types
- ✅ Example API functions
- ✅ Simplified environment variables

---

## 📋 Complete Setup (15 minutes)

### Step 1: Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign up or sign in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `finova`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Plan**: Free
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### Step 2: Get Your Credentials (2 minutes)

1. In your Supabase project dashboard
2. Go to **Project Settings** (⚙️ icon in sidebar)
3. Click **API** in the left menu
4. Copy these two values:

```
Project URL → NEXT_PUBLIC_SUPABASE_URL
anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 3: Update Environment Variables (1 minute)

Edit `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
NODE_ENV=development
```

### Step 4: Create Database Tables (3 minutes)

1. In Supabase Dashboard, click **SQL Editor** in sidebar
2. Click **"New query"**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

**This creates:**
- ✅ All tables (users, accounts, transactions, budgets, categories, goals)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers (updated_at)
- ✅ Default categories
- ✅ User profile creation on signup

### Step 5: Enable Authentication (2 minutes)

1. In Supabase Dashboard, go to **Authentication**
2. Click **Providers**
3. **Email** is enabled by default ✅

**Optional: Enable OAuth**

For Google sign-in:
1. Click **Google** provider
2. Enable it
3. Add your Google OAuth credentials
4. Save

### Step 6: Test Your Setup (2 minutes)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/auth-example

3. Try signing up with email/password

4. Check your email for confirmation link

5. Click the link to verify

6. Sign in!

---

## 🎯 How to Use Supabase in Your App

### Authentication

```typescript
import { supabase } from '@/lib/supabase'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

### Database Queries

```typescript
import { supabase } from '@/lib/supabase'

// Get all transactions
const { data, error } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', userId)
  .order('date', { ascending: false })

// Create transaction
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    account_id: accountId,
    amount: 100.50,
    type: 'EXPENSE',
    description: 'Groceries',
  })
  .select()
  .single()

// Update transaction
const { data, error } = await supabase
  .from('transactions')
  .update({ amount: 120.00 })
  .eq('id', transactionId)
  .select()
  .single()

// Delete transaction
const { error } = await supabase
  .from('transactions')
  .delete()
  .eq('id', transactionId)
```

### Joins (Relations)

```typescript
// Get transactions with category and account info
const { data, error } = await supabase
  .from('transactions')
  .select(`
    *,
    category:categories(*),
    account:accounts(id, name, icon)
  `)
  .eq('user_id', userId)
```

### Real-time Subscriptions

```typescript
// Listen to transaction changes
const channel = supabase
  .channel('transactions')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received!', payload)
      // Update your UI
    }
  )
  .subscribe()

// Cleanup
supabase.removeChannel(channel)
```

### File Upload (Receipts)

```typescript
// First, create a storage bucket in Supabase Dashboard
// Storage → New Bucket → Name: "receipts" → Private

// Upload file
const { data, error } = await supabase.storage
  .from('receipts')
  .upload(`${userId}/${transactionId}.jpg`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('receipts')
  .getPublicUrl(`${userId}/${transactionId}.jpg`)

// Save URL to transaction
await supabase
  .from('transactions')
  .update({ receipt_url: publicUrl })
  .eq('id', transactionId)
```

---

## 📁 Project Structure

```
finova-app/
├── src/
│   ├── lib/
│   │   ├── supabase.ts           ✅ Supabase client
│   │   ├── utils.ts              ✅ Helper functions
│   │   └── api/
│   │       ├── transactions.ts   ✅ Transaction API functions
│   │       └── accounts.ts       ✅ Account API functions
│   │
│   ├── types/
│   │   ├── database.types.ts     ✅ Auto-generated types
│   │   ├── transaction.ts        ✅ Transaction types
│   │   ├── account.ts            ✅ Account types
│   │   └── budget.ts             ✅ Budget types
│   │
│   └── app/
│       ├── auth-example/         ✅ Auth example page
│       └── dashboard/            ✅ Dashboard pages
│
├── supabase/
│   └── schema.sql                ✅ Database schema
│
└── .env.local                    ✅ Environment variables
```

---

## 🔒 Security (Row Level Security)

All tables have RLS enabled! Users can only:
- ✅ View their own data
- ✅ Create their own data
- ✅ Update their own data
- ✅ Delete their own data

**Example RLS Policy:**
```sql
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);
```

This is enforced at the **database level**, so even if someone tries to access data directly, they can't bypass it!

---

## 🎨 Example: Creating a Transaction

### 1. Create API Route

`src/app/api/transactions/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
```

### 2. Use in Component

```typescript
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddTransaction() {
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user!.id,
        account_id: 'account-id',
        amount: parseFloat(amount),
        type: 'EXPENSE',
        description: 'New transaction',
      })
      .select()
      .single()

    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Created:', data)
      setAmount('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button type="submit">Add Transaction</button>
    </form>
  )
}
```

---

## 🔄 Auto-Generate TypeScript Types

After creating your tables, you can auto-generate types:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Generate types
npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts
```

This creates perfectly typed database interfaces!

---

## 📊 Example Queries

### Get User's Total Balance

```typescript
const { data } = await supabase
  .from('accounts')
  .select('balance')
  .eq('user_id', userId)

const total = data.reduce((sum, acc) => sum + acc.balance, 0)
```

### Get Monthly Expenses

```typescript
const { data } = await supabase
  .from('transactions')
  .select('amount')
  .eq('user_id', userId)
  .eq('type', 'EXPENSE')
  .gte('date', '2024-12-01')
  .lte('date', '2024-12-31')

const total = data.reduce((sum, t) => sum + t.amount, 0)
```

### Get Budget Progress

```typescript
const { data: budgets } = await supabase
  .from('budgets')
  .select(`
    *,
    category:categories(name, icon, color)
  `)
  .eq('user_id', userId)
  .eq('period', 'MONTHLY')

// For each budget, get spent amount
for (const budget of budgets) {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('category_id', budget.category_id)
    .eq('type', 'EXPENSE')
    .gte('date', budget.start_date)

  const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
  budget.spent = spent
  budget.remaining = budget.amount - spent
  budget.percentage = (spent / budget.amount) * 100
}
```

---

## 🎯 Next Steps

1. ✅ Complete setup above
2. ✅ Test authentication at `/auth-example`
3. ✅ Create your first transaction in Supabase Table Editor
4. ✅ Build your first feature using the API examples
5. ✅ Add real-time updates to your dashboard

---

## 📚 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Real-time**: https://supabase.com/docs/guides/realtime

---

## ❓ FAQ

**Q: How do I view my data?**
A: Go to Supabase Dashboard → Table Editor

**Q: How do I add more columns?**
A: Table Editor → Select table → Add column, or use SQL Editor

**Q: Can I use Supabase with Next.js API routes?**
A: Yes! Import the client and use it anywhere

**Q: Is RLS required?**
A: Highly recommended! It protects your data at the database level

**Q: Can I export my data?**
A: Yes! It's just PostgreSQL - you can export anytime

---

**You're all set!** 🎉

Everything is now pure Supabase - simpler, faster, and more powerful!

Start building your features using the examples in `src/lib/api/` 🚀
