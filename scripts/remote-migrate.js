
import fetch from 'node-fetch';

const PROJECT_REF = 'gilyduulqfujbvjflibw';
const ACCESS_TOKEN = 'sbp_cd8b04a576c997febd86586ef28f35877f19b932';

async function runSql() {
    const sql = `
    CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, phase TEXT NOT NULL, tags TEXT[] DEFAULT '{}', team_members JSONB DEFAULT '[]'::jsonb, needs TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS backlog_ideas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, skills TEXT NOT NULL, author TEXT NOT NULL, votes INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS join_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS problems (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user" TEXT NOT NULL, problem TEXT NOT NULL, job_to_be_done TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

    -- Enable RLS
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
    ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

    -- Create policies (drop first to avoid errors)
    DROP POLICY IF EXISTS "public_projects" ON projects;
    CREATE POLICY "public_projects" ON projects FOR ALL USING (true);
    
    DROP POLICY IF EXISTS "public_backlog" ON backlog_ideas;
    CREATE POLICY "public_backlog" ON backlog_ideas FOR ALL USING (true);
    
    DROP POLICY IF EXISTS "public_join" ON join_requests;
    CREATE POLICY "public_join" ON join_requests FOR ALL USING (true);
    
    DROP POLICY IF EXISTS "public_problems" ON problems;
    CREATE POLICY "public_problems" ON problems FOR ALL USING (true);

    -- Insert sample data if empty
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM projects) THEN
        INSERT INTO projects (title, description, phase, tags) VALUES ('Welcome to 10,000 IDEAS', 'Platform live!', 'Launch', ARRAY['welcome']);
      END IF;
    END
    $$;
  `;

    console.log('Sending SQL to Supabase Management API...');

    try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        console.log('✅ Success! Database migration executed.');
        const result = await response.json();
        console.log('Result:', result);

    } catch (error) {
        console.error('❌ Failed to execute SQL:', error.message);
    }
}

runSql();
