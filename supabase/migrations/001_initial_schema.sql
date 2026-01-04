-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phase TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  needs TEXT[] DEFAULT '{}',
  team_members JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create backlog_ideas table
CREATE TABLE IF NOT EXISTS backlog_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  skills TEXT NOT NULL,
  author TEXT NOT NULL,
  votes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create join_requests table
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user" TEXT NOT NULL,
  problem TEXT NOT NULL,
  job_to_be_done TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_phase ON projects(phase);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backlog_ideas_votes ON backlog_ideas(votes DESC);
CREATE INDEX IF NOT EXISTS idx_backlog_ideas_created_at ON backlog_ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_join_requests_project_id ON join_requests(project_id);

-- Enable Row Level Security (RLS) for public access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (no auth required for now)
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on projects" ON projects FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on backlog_ideas" ON backlog_ideas FOR SELECT USING (true);
CREATE POLICY "Allow public insert on backlog_ideas" ON backlog_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on backlog_ideas" ON backlog_ideas FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on join_requests" ON join_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on join_requests" ON join_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Allow public insert on problems" ON problems FOR INSERT WITH CHECK (true);
