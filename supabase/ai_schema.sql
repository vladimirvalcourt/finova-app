-- AI Features Database Schema

-- AI Insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'spending', 'budget', 'goal', 'anomaly', 'coaching'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  read BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  action_taken BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(type);
CREATE INDEX idx_ai_insights_read ON ai_insights(read);
CREATE INDEX idx_ai_insights_created_at ON ai_insights(created_at DESC);

-- Category corrections (for AI learning)
CREATE TABLE IF NOT EXISTS category_corrections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_description TEXT NOT NULL,
  ai_suggested_category_id UUID REFERENCES categories(id),
  user_selected_category_id UUID NOT NULL REFERENCES categories(id),
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_category_corrections_user_id ON category_corrections(user_id);
CREATE INDEX idx_category_corrections_description ON category_corrections(transaction_description);

-- AI categorization cache
CREATE TABLE IF NOT EXISTS ai_category_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description_normalized TEXT UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  confidence_score DECIMAL(3, 2),
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_category_cache_description ON ai_category_cache(description_normalized);
CREATE INDEX idx_ai_category_cache_usage ON ai_category_cache(usage_count DESC);

-- Receipt data (from OCR)
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  merchant_name TEXT,
  total_amount DECIMAL(15, 2),
  date DATE,
  items JSONB DEFAULT '[]', -- Array of {name, price, quantity}
  raw_ocr_text TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_receipts_user_id ON receipts(user_id);
CREATE INDEX idx_receipts_transaction_id ON receipts(transaction_id);

-- AI coaching sessions
CREATE TABLE IF NOT EXISTS ai_coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL, -- 'weekly_checkin', 'goal_review', 'budget_advice'
  messages JSONB DEFAULT '[]', -- Array of {role, content, timestamp}
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_coaching_user_id ON ai_coaching_sessions(user_id);
CREATE INDEX idx_ai_coaching_goal_id ON ai_coaching_sessions(goal_id);

-- Spending patterns (for anomaly detection)
CREATE TABLE IF NOT EXISTS spending_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  period TEXT NOT NULL, -- 'weekly', 'monthly'
  average_amount DECIMAL(15, 2),
  std_deviation DECIMAL(15, 2),
  min_amount DECIMAL(15, 2),
  max_amount DECIMAL(15, 2),
  transaction_count INTEGER,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, period)
);

CREATE INDEX idx_spending_patterns_user_id ON spending_patterns(user_id);
CREATE INDEX idx_spending_patterns_category_id ON spending_patterns(category_id);

-- AI feature usage tracking
CREATE TABLE IF NOT EXISTS ai_feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL, -- 'categorization', 'insights', 'receipt_scan', 'nl_entry', 'coaching'
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_name)
);

CREATE INDEX idx_ai_feature_usage_user_id ON ai_feature_usage(user_id);
CREATE INDEX idx_ai_feature_usage_feature ON ai_feature_usage(feature_name);

-- Enable RLS on all AI tables
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_insights
CREATE POLICY "Users can view own AI insights"
  ON ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI insights"
  ON ai_insights FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for category_corrections
CREATE POLICY "Users can view own category corrections"
  ON category_corrections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own category corrections"
  ON category_corrections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for receipts
CREATE POLICY "Users can view own receipts"
  ON receipts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts"
  ON receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts"
  ON receipts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts"
  ON receipts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for ai_coaching_sessions
CREATE POLICY "Users can view own coaching sessions"
  ON ai_coaching_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coaching sessions"
  ON ai_coaching_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for spending_patterns
CREATE POLICY "Users can view own spending patterns"
  ON spending_patterns FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for ai_feature_usage
CREATE POLICY "Users can view own AI feature usage"
  ON ai_feature_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update spending patterns
CREATE OR REPLACE FUNCTION update_spending_patterns(p_user_id UUID, p_category_id UUID, p_period TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO spending_patterns (user_id, category_id, period, average_amount, std_deviation, min_amount, max_amount, transaction_count)
  SELECT 
    p_user_id,
    p_category_id,
    p_period,
    AVG(amount),
    STDDEV(amount),
    MIN(amount),
    MAX(amount),
    COUNT(*)
  FROM transactions
  WHERE user_id = p_user_id 
    AND category_id = p_category_id
    AND date >= CASE 
      WHEN p_period = 'weekly' THEN NOW() - INTERVAL '8 weeks'
      WHEN p_period = 'monthly' THEN NOW() - INTERVAL '6 months'
    END
  GROUP BY user_id, category_id
  ON CONFLICT (user_id, category_id, period) 
  DO UPDATE SET
    average_amount = EXCLUDED.average_amount,
    std_deviation = EXCLUDED.std_deviation,
    min_amount = EXCLUDED.min_amount,
    max_amount = EXCLUDED.max_amount,
    transaction_count = EXCLUDED.transaction_count,
    last_calculated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track AI feature usage
CREATE OR REPLACE FUNCTION track_ai_feature_usage(p_user_id UUID, p_feature_name TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO ai_feature_usage (user_id, feature_name, usage_count, last_used_at)
  VALUES (p_user_id, p_feature_name, 1, NOW())
  ON CONFLICT (user_id, feature_name)
  DO UPDATE SET
    usage_count = ai_feature_usage.usage_count + 1,
    last_used_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
