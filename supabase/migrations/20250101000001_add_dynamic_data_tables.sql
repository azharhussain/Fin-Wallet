/*
          # [Operation Name] Create Tables for Dynamic App Data
          [This migration creates the necessary tables for transactions, cards, investments, and user holdings to make the application fully dynamic.]

          ## Query Description: [This script adds four new tables: `cards`, `investments`, `holdings`, and `transactions`. It also enables Row Level Security (RLS) and defines policies to ensure users can only access their own data. The `investments` table is populated with some sample public data. No existing data will be modified or deleted.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Creates table: `cards`
          - Creates table: `investments`
          - Creates table: `holdings`
          - Creates table: `transactions`
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created for each table.
          - Auth Requirements: Policies are based on `auth.uid()`.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed automatically.
          - Triggers: None.
          - Estimated Impact: Low.
          */

-- 1. Create cards table
CREATE TABLE public.cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    last_four_digits TEXT NOT NULL,
    gradient_colors TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Add comments to cards table
COMMENT ON TABLE public.cards IS 'Stores user''s debit and credit cards.';

-- 3. Enable RLS for cards table
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for cards table
CREATE POLICY "Users can view their own cards"
ON public.cards FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
ON public.cards FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON public.cards FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
ON public.cards FOR DELETE
USING (auth.uid() = user_id);


-- 5. Create investments table (publicly readable)
CREATE TABLE public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT UNIQUE NOT NULL,
    current_price NUMERIC(10, 2) NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Add comments to investments table
COMMENT ON TABLE public.investments IS 'Stores available investments like stocks and ETFs.';

-- 7. Enable RLS for investments table
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for investments table
CREATE POLICY "All users can view investments"
ON public.investments FOR SELECT
USING (true);


-- 9. Create holdings table
CREATE TABLE public.holdings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_id UUID REFERENCES public.investments(id) ON DELETE CASCADE NOT NULL,
    quantity NUMERIC(10, 4) NOT NULL,
    average_purchase_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, investment_id)
);

-- 10. Add comments to holdings table
COMMENT ON TABLE public.holdings IS 'Tracks user investments and holdings.';

-- 11. Enable RLS for holdings table
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;

-- 12. Create policies for holdings table
CREATE POLICY "Users can view their own holdings"
ON public.holdings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own holdings"
ON public.holdings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holdings"
ON public.holdings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holdings"
ON public.holdings FOR DELETE
USING (auth.uid() = user_id);


-- 13. Create transactions table
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense', or 'savings'
    merchant TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 14. Add comments to transactions table
COMMENT ON TABLE public.transactions IS 'Stores all user financial transactions.';

-- 15. Enable RLS for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 16. Create policies for transactions table
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.transactions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.transactions FOR DELETE
USING (auth.uid() = user_id);


-- 17. Seed the public investments table with some sample data
INSERT INTO public.investments (name, symbol, current_price, color)
VALUES
    ('Tech Growth ETF', 'TECH', 152.45, '#10B981'),
    ('S&P 500 Index', 'SPY', 450.78, '#3B82F6'),
    ('Crypto Bundle', 'CRYPTO', 88.92, '#F59E0B'),
    ('Clean Energy', 'CLEAN', 76.33, '#10B981'),
    ('Global REIT', 'REIT', 112.50, '#8B5CF6');
