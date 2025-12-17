-- Add nationality and localization preferences to users table

-- Extend users table with localization preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US';
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality TEXT; -- 'MX', 'DO', 'PR', 'CU', 'HT', etc.
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_format TEXT DEFAULT 'MM/DD/YYYY';
ALTER TABLE users ADD COLUMN IF NOT EXISTS number_format TEXT DEFAULT 'US'; -- 'US' or 'EU'
ALTER TABLE users ADD COLUMN IF NOT EXISTS show_remittance_tracking BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_terms JSONB DEFAULT '{}';

-- Create nationality configurations table
CREATE TABLE IF NOT EXISTS nationality_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- 'MX', 'DO', 'PR', etc.
  name TEXT NOT NULL,
  locale TEXT NOT NULL,
  flag TEXT NOT NULL,
  currency TEXT NOT NULL,
  date_format TEXT NOT NULL,
  terms JSONB NOT NULL, -- { "money": "cuartos", "groceries": "colmado", etc. }
  default_categories JSONB NOT NULL,
  enable_remittances BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert nationality configurations
INSERT INTO nationality_configs (code, name, locale, flag, currency, date_format, terms, default_categories, enable_remittances) VALUES
-- Haitian
('HT', 'Haiti', 'ht-HT', '🇭🇹', 'USD', 'DD/MM/YYYY', 
 '{"money": "lajan", "groceries": "manje", "transportation": "transpò", "phone": "telefòn"}',
 '["Remesas", "Lwaye", "Transpò", "Telefòn", "Manje"]', TRUE),

-- Dominican Republic
('DO', 'República Dominicana', 'es-DO', '🇩🇴', 'USD', 'DD/MM/YYYY',
 '{"money": "cuartos", "groceries": "colmado", "transportation": "guagua", "phone": "recarga"}',
 '["Remesas", "Colmado", "Guagua", "Luz", "Recarga"]', TRUE),

-- Puerto Rico
('PR', 'Puerto Rico', 'es-PR', '🇵🇷', 'USD', 'MM/DD/YYYY',
 '{"money": "chavos", "groceries": "compras", "transportation": "guagua", "gas": "gasolina"}',
 '["Compras", "Gasolina", "Renta", "Utilidades", "Comida"]', FALSE),

-- Mexico
('MX', 'México', 'es-MX', '🇲🇽', 'MXN', 'DD/MM/YYYY',
 '{"money": "lana", "groceries": "despensa", "transportation": "camión", "bus": "camión"}',
 '["Despensa", "Transporte", "Comida Fuera", "Luz y Gas", "Celular"]', TRUE),

-- Cuba
('CU', 'Cuba', 'es-CU', '🇨🇺', 'USD', 'DD/MM/YYYY',
 '{"money": "fula", "groceries": "bodega", "transportation": "guagua", "thousand": "kilo"}',
 '["Remesas", "Bodega", "Transporte", "Recargas", "Comida"]', TRUE),

-- El Salvador
('SV', 'El Salvador', 'es-SV', '🇸🇻', 'USD', 'DD/MM/YYYY',
 '{"money": "pisto", "groceries": "despensa"}',
 '["Remesas", "Despensa", "Bus", "Servicios", "Comida"]', TRUE),

-- Guatemala
('GT', 'Guatemala', 'es-GT', '🇬🇹', 'GTQ', 'DD/MM/YYYY',
 '{"money": "pisto", "dollar": "chivo"}',
 '["Remesas", "Despensa", "Transporte", "Servicios", "Comida"]', TRUE),

-- Honduras
('HN', 'Honduras', 'es-HN', '🇭🇳', 'HNL', 'DD/MM/YYYY',
 '{"money": "pisto", "currency": "lempiras"}',
 '["Remesas", "Despensa", "Transporte", "Servicios", "Comida"]', TRUE),

-- Colombia
('CO', 'Colombia', 'es-CO', '🇨🇴', 'COP', 'DD/MM/YYYY',
 '{"money": "plata", "groceries": "mercado", "delivery": "domicilios"}',
 '["Mercado", "Transporte", "Domicilios", "Servicios Públicos", "Celular"]', TRUE),

-- Venezuela
('VE', 'Venezuela', 'es-VE', '🇻🇪', 'USD', 'DD/MM/YYYY',
 '{"money": "plata", "dollars": "verdes"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Ecuador
('EC', 'Ecuador', 'es-EC', '🇪🇨', 'USD', 'DD/MM/YYYY',
 '{"money": "plata", "dollars": "verdes"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Peru
('PE', 'Perú', 'es-PE', '🇵🇪', 'PEN', 'DD/MM/YYYY',
 '{"money": "plata", "currency": "soles"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Argentina
('AR', 'Argentina', 'es-AR', '🇦🇷', 'ARS', 'DD/MM/YYYY',
 '{"money": "guita", "informal": "mango", "million": "palo"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Chile
('CL', 'Chile', 'es-CL', '🇨🇱', 'CLP', 'DD/MM/YYYY',
 '{"money": "plata", "thousand": "luca", "hundred": "gamba"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Bolivia
('BO', 'Bolivia', 'es-BO', '🇧🇴', 'BOB', 'DD/MM/YYYY',
 '{"money": "plata", "currency": "bolivianos"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Paraguay
('PY', 'Paraguay', 'es-PY', '🇵🇾', 'PYG', 'DD/MM/YYYY',
 '{"money": "guita", "currency": "guaraníes"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- Uruguay
('UY', 'Uruguay', 'es-UY', '🇺🇾', 'UYU', 'DD/MM/YYYY',
 '{"money": "guita", "informal": "mango"}',
 '["Mercado", "Transporte", "Servicios", "Comida", "Celular"]', TRUE),

-- United States (default)
('US', 'United States', 'en-US', '🇺🇸', 'USD', 'MM/DD/YYYY',
 '{"money": "money", "groceries": "groceries", "transportation": "transportation"}',
 '["Groceries", "Transportation", "Dining", "Utilities", "Entertainment"]', FALSE);

-- Create remittances table for tracking money sent/received
CREATE TABLE IF NOT EXISTS remittances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'sent' or 'received'
  amount DECIMAL(15, 2) NOT NULL,
  recipient_name TEXT,
  recipient_country TEXT,
  service_used TEXT, -- 'Western Union', 'Remitly', 'MoneyGram', etc.
  fees DECIMAL(15, 2) DEFAULT 0,
  exchange_rate DECIMAL(10, 4),
  date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_remittances_user_id ON remittances(user_id);
CREATE INDEX idx_remittances_date ON remittances(date);

-- Enable RLS on remittances
ALTER TABLE remittances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own remittances"
  ON remittances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own remittances"
  ON remittances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own remittances"
  ON remittances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own remittances"
  ON remittances FOR DELETE
  USING (auth.uid() = user_id);

-- Create category translations table
CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, locale)
);

CREATE INDEX idx_category_translations_category_id ON category_translations(category_id);
CREATE INDEX idx_category_translations_locale ON category_translations(locale);

-- Insert default category translations for common categories

-- Groceries
INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'es-DO', 'Colmado', 'Compras en el colmado'
FROM categories WHERE name = 'Groceries' AND user_id IS NULL;

INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'es-MX', 'Despensa', 'Compras en el súper'
FROM categories WHERE name = 'Groceries' AND user_id IS NULL;

INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'ht-HT', 'Manje', 'Achte manje'
FROM categories WHERE name = 'Groceries' AND user_id IS NULL;

-- Transportation
INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'es-DO', 'Guagua', 'Transporte público'
FROM categories WHERE name = 'Transportation' AND user_id IS NULL;

INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'es-MX', 'Transporte', 'Camión, metro, gasolina'
FROM categories WHERE name = 'Transportation' AND user_id IS NULL;

INSERT INTO category_translations (category_id, locale, name, description)
SELECT id, 'ht-HT', 'Transpò', 'Transpò piblik'
FROM categories WHERE name = 'Transportation' AND user_id IS NULL;
