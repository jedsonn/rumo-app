-- ============================================
-- RUMO DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  is_blue_theme BOOLEAN DEFAULT true,
  is_dark_mode BOOLEAN DEFAULT false,
  column_split INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- REWARDS TABLE (must be created before goals for FK)
-- ============================================
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0,
  earned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Policies for rewards
CREATE POLICY "Users can view own rewards" ON rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards" ON rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards" ON rewards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rewards" ON rewards
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- GOALS TABLE
-- ============================================
CREATE TYPE goal_status AS ENUM ('Doing', 'On Track', 'For Later', 'Done', 'Dropped');
CREATE TYPE goal_period AS ENUM ('One-year', 'Three-years', 'Five-years');
CREATE TYPE goal_category AS ENUM ('Personal', 'Professional');

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number INTEGER NOT NULL DEFAULT 1,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  goal TEXT NOT NULL,
  period goal_period NOT NULL DEFAULT 'One-year',
  category goal_category NOT NULL DEFAULT 'Personal',
  status goal_status NOT NULL DEFAULT 'Doing',
  action TEXT,
  cost DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  pinned BOOLEAN DEFAULT false,
  linked_reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policies for goals
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_goals_user_year ON goals(user_id, year);
CREATE INDEX idx_goals_category ON goals(user_id, category);

-- ============================================
-- BLESSINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blessings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category goal_category DEFAULT 'Personal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;

-- Policies for blessings
CREATE POLICY "Users can view own blessings" ON blessings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blessings" ON blessings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own blessings" ON blessings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to auto-increment goal number
CREATE OR REPLACE FUNCTION get_next_goal_number(p_user_id UUID, p_category goal_category, p_year INTEGER)
RETURNS INTEGER AS $$
DECLARE
  max_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(number), 0) + 1 INTO max_num
  FROM goals
  WHERE user_id = p_user_id AND category = p_category AND year = p_year;
  RETURN max_num;
END;
$$ LANGUAGE plpgsql;
