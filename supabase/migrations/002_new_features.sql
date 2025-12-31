-- ============================================
-- RUMO DATABASE SCHEMA - NEW FEATURES
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql
-- ============================================

-- ============================================
-- VISION BOARD ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vision_board_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category goal_category DEFAULT 'Personal',
  linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 200,
  height INTEGER DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own vision board items" ON vision_board_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vision board items" ON vision_board_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision board items" ON vision_board_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision board items" ON vision_board_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- GOAL MILESTONES TABLE (subtasks)
-- ============================================
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own milestones" ON goal_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON goal_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones" ON goal_milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones" ON goal_milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_milestones_goal ON goal_milestones(goal_id);

-- ============================================
-- GOAL PROGRESS NOTES TABLE (journaling)
-- ============================================
CREATE TABLE IF NOT EXISTS goal_progress_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  progress_percent INTEGER, -- optional snapshot of progress at time of note
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE goal_progress_notes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own progress notes" ON goal_progress_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress notes" ON goal_progress_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress notes" ON goal_progress_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_progress_notes_goal ON goal_progress_notes(goal_id);

-- ============================================
-- HABITS TABLE (recurring goals)
-- ============================================
CREATE TYPE recurrence_type AS ENUM ('daily', 'weekly', 'monthly');

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category goal_category DEFAULT 'Personal',
  recurrence recurrence_type NOT NULL DEFAULT 'daily',
  target_days_per_week INTEGER DEFAULT 7, -- for weekly habits
  color TEXT DEFAULT '#3b82f6',
  active BOOLEAN DEFAULT true,
  linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HABIT COMPLETIONS TABLE (for streaks)
-- ============================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- Enable RLS
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own habit completions" ON habit_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit completions" ON habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions" ON habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(user_id, completed_date);

-- ============================================
-- MOTIVATIONAL QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'motivation'
);

-- Insert some default quotes
INSERT INTO quotes (text, author, category) VALUES
  ('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
  ('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'motivation'),
  ('Believe you can and you''re halfway there.', 'Theodore Roosevelt', 'motivation'),
  ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'motivation'),
  ('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 'motivation'),
  ('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb', 'motivation'),
  ('Your limitation—it''s only your imagination.', 'Unknown', 'motivation'),
  ('Push yourself, because no one else is going to do it for you.', 'Unknown', 'motivation'),
  ('Great things never come from comfort zones.', 'Unknown', 'motivation'),
  ('Dream it. Wish it. Do it.', 'Unknown', 'motivation'),
  ('Success doesn''t just find you. You have to go out and get it.', 'Unknown', 'motivation'),
  ('The harder you work for something, the greater you''ll feel when you achieve it.', 'Unknown', 'motivation'),
  ('Don''t stop when you''re tired. Stop when you''re done.', 'Unknown', 'motivation'),
  ('Wake up with determination. Go to bed with satisfaction.', 'Unknown', 'motivation'),
  ('Do something today that your future self will thank you for.', 'Unknown', 'motivation'),
  ('Little things make big days.', 'Unknown', 'motivation'),
  ('It''s going to be hard, but hard does not mean impossible.', 'Unknown', 'motivation'),
  ('Don''t wait for opportunity. Create it.', 'Unknown', 'motivation'),
  ('Sometimes we''re tested not to show our weaknesses, but to discover our strengths.', 'Unknown', 'motivation'),
  ('The key to success is to focus on goals, not obstacles.', 'Unknown', 'motivation');

-- Public read access for quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quotes" ON quotes FOR SELECT TO PUBLIC USING (true);

-- ============================================
-- ADD COLUMNS TO EXISTING TABLES
-- ============================================

-- Add progress and due_date to goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS due_date DATE;

-- Add focus_mode to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS focus_mode TEXT DEFAULT 'all';

-- ============================================
-- TRIGGERS FOR NEW TABLES
-- ============================================

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO CALCULATE HABIT STREAK
-- ============================================
CREATE OR REPLACE FUNCTION get_habit_streak(p_habit_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  found BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM habit_completions
      WHERE habit_id = p_habit_id AND completed_date = check_date
    ) INTO found;

    IF found THEN
      streak := streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql;
