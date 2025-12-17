# 🎯 Quick Start - Run These SQL Files NOW

## ✅ Your Supabase is Connected!

**Project URL**: https://yxouyhiervgrnaoyupsx.supabase.co
**Status**: Credentials configured ✅

---

## 📝 Next Step: Run Database Migrations

### **Go to SQL Editor**:
👉 https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/sql/new

---

## **Migration 1: Core Schema** (Run First)

**File**: `supabase/schema.sql`

**What to do**:
1. Open `supabase/schema.sql` in your editor
2. Copy ALL contents (Cmd+A, Cmd+C)
3. Go to SQL Editor (link above)
4. Paste into editor
5. Click "Run" (or Cmd+Enter)
6. Wait for "Success" message

**Creates**: users, accounts, transactions, categories, budgets, goals (6 tables)

---

## **Migration 2: Nationality Schema** (Run Second)

**File**: `supabase/nationality_schema.sql`

**What to do**:
1. Open `supabase/nationality_schema.sql`
2. Copy ALL contents
3. Paste in SQL Editor (same link)
4. Click "Run"
5. Wait for "Success"

**Creates**: nationality_configs, remittances, category_translations (3 tables + data)

---

## **Migration 3: AI Schema** (Run Third)

**File**: `supabase/ai_schema.sql`

**What to do**:
1. Open `supabase/ai_schema.sql`
2. Copy ALL contents
3. Paste in SQL Editor
4. Click "Run"
5. Wait for "Success"

**Creates**: ai_insights, receipts, ai_coaching_sessions, spending_patterns, etc. (7 tables)

---

## ✅ Verify Tables Created

**Go to Table Editor**:
👉 https://supabase.com/dashboard/project/yxouyhiervgrnaoyupsx/editor

**You should see 16 tables**:
- users
- accounts
- transactions
- categories
- budgets
- goals
- nationality_configs
- remittances
- category_translations
- ai_insights
- category_corrections
- ai_category_cache
- receipts
- ai_coaching_sessions
- spending_patterns
- ai_feature_usage

---

## 🚨 If You Get Errors

**"relation already exists"**:
- Table already created, skip that migration
- Or drop the table and re-run

**"syntax error"**:
- Make sure you copied the ENTIRE file
- Check you didn't miss any lines

**"permission denied"**:
- You're using the right project
- You're logged in to Supabase

---

## 🎉 Once Complete

Your database will be ready! Then we can:
1. ✅ Test the connection
2. ✅ Create a test user
3. ✅ Connect the dashboard to real data
4. ✅ Start building!

---

## 🔥 Quick Test After Migrations

Run this in SQL Editor to verify:
```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should return 16 rows!

---

**Ready? Go run those 3 SQL files!** 🚀

**Estimated time**: 2-3 minutes total
