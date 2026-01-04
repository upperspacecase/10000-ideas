-- Add is_todays_launch column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_todays_launch BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_by TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS url TEXT;

-- Create index for faster today's launch lookup
CREATE INDEX IF NOT EXISTS idx_projects_todays_launch ON projects(is_todays_launch) WHERE is_todays_launch = true;
