# 🚀 Supabase Setup - Step-by-Step Guide

## ✅ Step 1: Get Your API Keys (DO THIS NOW)

Your Supabase project: `https://yxouyhiervgrnaoyupsx.supabase.co`

### **Get Your Anon Key**:

1. Go to: https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/settings/api
2. Find the **"anon" "public"** key
3. Copy it
4. Paste it in `.env.local` replacing `your-anon-key-here`

**Your `.env.local` should look like**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yxouyhiervgrnaoyupsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV="development"
```

---

## ✅ Step 2: Run Database Migrations (CRITICAL)

You need to run 3 SQL files in the Supabase SQL Editor:

### **Go to SQL Editor**:
https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/sql/new

### **Run These Files in Order**:

#### **1. Core Schema** (Run First)
- File: `supabase/schema.sql`
- What it does: Creates users, accounts, transactions, categories, budgets, goals tables
- **Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### **2. Nationality Schema** (Run Second)
- File: `supabase/nationality_schema.sql`
- What it does: Adds multilingual support, remittances, nationality configs
- **Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### **3. AI Schema** (Run Third)
- File: `supabase/ai_schema.sql`
- What it does: Adds AI insights, receipts, coaching, pattern detection
- **Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

---

## ✅ Step 3: Verify Tables Were Created

### **Check Tables**:
Go to: https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/editor

You should see these tables:
- ✅ users
- ✅ accounts
- ✅ transactions
- ✅ categories
- ✅ budgets
- ✅ goals
- ✅ nationality_configs
- ✅ remittances
- ✅ category_translations
- ✅ ai_insights
- ✅ category_corrections
- ✅ ai_category_cache
- ✅ receipts
- ✅ ai_coaching_sessions
- ✅ spending_patterns
- ✅ ai_feature_usage

**Total**: 16 tables

---

## ✅ Step 4: Enable Authentication

### **Go to Authentication Settings**:
https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/auth/users

### **Enable Email Auth**:
1. Go to "Providers" tab
2. Make sure "Email" is enabled
3. **Disable** "Confirm email" for testing (you can enable later)

### **Optional: Enable Google OAuth**:
1. Go to "Providers" tab
2. Enable "Google"
3. Add your Google OAuth credentials (or skip for now)

---

## ✅ Step 5: Test Connection

### **Restart Your Dev Server**:
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### **Test in Browser Console**:
1. Open http://localhost:3000
2. Open browser console (F12)
3. Run this:
```javascript
// Test Supabase connection
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://yxouyhiervgrnaoyupsx.supabase.co',
  'YOUR_ANON_KEY_HERE'
);
const { data, error } = await supabase.from('users').select('count');
console.log('Connection test:', data, error);
```

**Expected Result**: Should return `{ count: 0 }` (no error)

---

## ✅ Step 6: Create Test User

### **Go to Authentication**:
https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/auth/users

### **Add User Manually** (for testing):
1. Click "Add user" → "Create new user"
2. Email: `test@finova.app`
3. Password: `Test123456!`
4. Click "Create user"

### **Or Use the Auth Example Page**:
1. Go to: http://localhost:3000/auth-example
2. Sign up with email/password
3. Check Supabase dashboard to see user created

---

## ✅ Step 7: Insert Test Data (Optional)

### **Add Some Categories**:
Go to SQL Editor and run:
```sql
-- Insert default categories
INSERT INTO categories (name, type, icon, color, user_id) VALUES
  ('Salary', 'income', '💰', '#10b981', NULL),
  ('Groceries', 'expense', '🛒', '#ef4444', NULL),
  ('Transportation', 'expense', '🚗', '#f59e0b', NULL),
  ('Utilities', 'expense', '⚡', '#8b5cf6', NULL),
  ('Entertainment', 'expense', '🎬', '#ec4899', NULL),
  ('Dining', 'expense', '🍔', '#f97316', NULL);
```

### **Add Test Account** (after creating user):
```sql
-- Replace USER_ID with your test user's ID from auth.users table
INSERT INTO accounts (user_id, name, type, balance, currency, color) VALUES
  ('USER_ID_HERE', 'Checking Account', 'checking', 5000.00, 'USD', '#6366f1');
```

---

## 🎯 **What Happens Next**

Once you complete these steps:

1. ✅ Your database is ready
2. ✅ Authentication works
3. ✅ You can create users
4. ✅ Ready to connect UI to real data

---

## 🚨 **Common Issues & Solutions**

### **Issue: "relation does not exist"**
**Solution**: You didn't run the SQL migrations. Go back to Step 2.

### **Issue: "Invalid API key"**
**Solution**: Check your anon key in `.env.local`. Make sure it's the full key.

### **Issue: "Row Level Security policy violation"**
**Solution**: Make sure you're authenticated. RLS policies require a user to be logged in.

### **Issue: Tables not showing up**
**Solution**: 
1. Make sure you ran all 3 SQL files
2. Check for errors in SQL Editor
3. Refresh the Table Editor page

---

## 📝 **Checklist**

- [ ] Got Supabase URL (already done ✅)
- [ ] Got anon key from dashboard
- [ ] Updated `.env.local` with anon key
- [ ] Ran `supabase/schema.sql`
- [ ] Ran `supabase/nationality_schema.sql`
- [ ] Ran `supabase/ai_schema.sql`
- [ ] Verified 16 tables exist
- [ ] Enabled email authentication
- [ ] Tested connection in browser
- [ ] Created test user
- [ ] (Optional) Inserted test data

---

## 🎉 **Once Complete**

You'll be ready to:
1. Connect dashboard to real data
2. Build auth pages
3. Add charts
4. Launch MVP!

---

## 🆘 **Need Help?**

If you encounter any issues:
1. Check the Supabase logs: https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/logs/explorer
2. Verify your API keys are correct
3. Make sure all SQL migrations ran successfully
4. Check browser console for errors

---

**Next Step**: Get your anon key and update `.env.local`, then run the SQL migrations! 🚀
