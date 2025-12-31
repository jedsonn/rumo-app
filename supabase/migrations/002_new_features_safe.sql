-- ============================================
-- RUMO DATABASE SCHEMA - NEW FEATURES (SAFE VERSION)
-- This version handles existing objects gracefully
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

ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can insert own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can update own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can delete own vision board items" ON vision_board_items;

CREATE POLICY "Users can view own vision board items" ON vision_board_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vision board items" ON vision_board_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vision board items" ON vision_board_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vision board items" ON vision_board_items FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- GOAL MILESTONES TABLE
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

ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can insert own milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can update own milestones" ON goal_milestones;
DROP POLICY IF EXISTS "Users can delete own milestones" ON goal_milestones;

CREATE POLICY "Users can view own milestones" ON goal_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON goal_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON goal_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON goal_milestones FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_milestones_goal ON goal_milestones(goal_id);

-- ============================================
-- GOAL PROGRESS NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS goal_progress_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  progress_percent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE goal_progress_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress notes" ON goal_progress_notes;
DROP POLICY IF EXISTS "Users can insert own progress notes" ON goal_progress_notes;
DROP POLICY IF EXISTS "Users can delete own progress notes" ON goal_progress_notes;

CREATE POLICY "Users can view own progress notes" ON goal_progress_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress notes" ON goal_progress_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress notes" ON goal_progress_notes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_progress_notes_goal ON goal_progress_notes(goal_id);

-- ============================================
-- HABITS TABLE
-- ============================================
DO $$ BEGIN
  CREATE TYPE recurrence_type AS ENUM ('daily', 'weekly', 'monthly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category goal_category DEFAULT 'Personal',
  recurrence recurrence_type NOT NULL DEFAULT 'daily',
  target_days_per_week INTEGER DEFAULT 7,
  color TEXT DEFAULT '#3b82f6',
  active BOOLEAN DEFAULT true,
  linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON habits;
DROP POLICY IF EXISTS "Users can update own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON habits;

CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HABIT COMPLETIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can insert own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can delete own habit completions" ON habit_completions;

CREATE POLICY "Users can view own habit completions" ON habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit completions" ON habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit completions" ON habit_completions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(user_id, completed_date);

-- ============================================
-- QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  author TEXT,
  category TEXT DEFAULT 'motivation'
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view quotes" ON quotes;
CREATE POLICY "Anyone can view quotes" ON quotes FOR SELECT TO PUBLIC USING (true);

-- Insert quotes only if table is empty
INSERT INTO quotes (text, author, category)
SELECT * FROM (VALUES
  ('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
  ('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'motivation'),
  ('Believe you can and you are halfway there.', 'Theodore Roosevelt', 'motivation'),
  ('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'motivation'),
  ('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 'motivation'),
  ('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb', 'motivation'),
  ('Push yourself, because no one else is going to do it for you.', 'Unknown', 'motivation'),
  ('Great things never come from comfort zones.', 'Unknown', 'motivation'),
  ('Dream it. Wish it. Do it.', 'Unknown', 'motivation'),
  ('Wake up with determination. Go to bed with satisfaction.', 'Unknown', 'motivation')
) AS new_quotes(text, author, category)
WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);

-- ============================================
-- ADD COLUMNS TO EXISTING TABLES
-- ============================================
ALTER TABLE goals ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS focus_mode TEXT DEFAULT 'all';

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STREAK FUNCTION
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
