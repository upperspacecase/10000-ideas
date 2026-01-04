
import pg from 'pg';
const { Client } = pg;

// Connection string constructed from user provided details
// Try Direct connection first (port 5432)
const connectionString = 'postgresql://postgres:enotGE6bENnkVnJE@db.gilyduulqfujbvjflibw.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const sql = `
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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Create policies (drop existing first to avoid errors if re-running)
DROP POLICY IF EXISTS "public_projects" ON projects;
CREATE POLICY "public_projects" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "public_backlog" ON backlog_ideas;
CREATE POLICY "public_backlog" ON backlog_ideas FOR ALL USING (true);

DROP POLICY IF EXISTS "public_join" ON join_requests;
CREATE POLICY "public_join" ON join_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "public_problems" ON problems;
CREATE POLICY "public_problems" ON problems FOR ALL USING (true);
`;

async function migrate() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected! Running migrations...');

    await client.query(sql);
    console.log('Tables created successfully!');

    // Check if we need to seed data
    const res = await client.query('SELECT count(*) from projects');
    if (res.rows[0].count === '0') {
      console.log('Seeding sample project...');
      await client.query(`
        INSERT INTO projects (title, description, phase, tags) 
        VALUES ('Welcome to 10,000 IDEAS', 'This is a sample project to verify setup.', 'Launch', ARRAY['demo', 'welcome'])
      `);
      console.log('Sample project seeded.');
    }

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
