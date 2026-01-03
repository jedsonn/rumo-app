-- ============================================
-- ADD SUBTASKS COLUMN
-- Missing from initial schema
-- ============================================

-- Add subtasks column to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]';

-- Comment
COMMENT ON COLUMN goals.subtasks IS 'AI-generated subtasks: [{ "text": "...", "completed": false, "estimated_time": "1 hour" }]';
