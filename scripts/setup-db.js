// Run migrations using Supabase service role
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gilyduulqfujbvjflibw.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpbHlkdXVscWZ1amJ2amZsaWJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQ3MjA3MywiZXhwIjoyMDgzMDQ4MDczfQ.VhlmfUUqb3GTytJItc5E6QGzgKqQFpbGF3XizQWssjY';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

async function runMigration() {
    console.log('Running database migration...\n');

    // Create projects table
    const { error: e1 } = await supabase.rpc('exec_sql', {
        sql: `CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      phase TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      needs TEXT[] DEFAULT '{}',
      team_members JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
    });

    if (e1 && !e1.message.includes('already exists')) {
        // Try direct insertion approach instead
        console.log('RPC not available, trying alternative...');

        // Test if table exists by trying to query
        const { error: testError } = await supabase.from('projects').select('id').limit(1);

        if (testError && testError.code === '42P01') {
            console.log('❌ Tables do not exist.');
            console.log('\nPlease run this SQL in Supabase Dashboard > SQL Editor:');
            console.log('https://supabase.com/dashboard/project/gilyduulqfujbvjflibw/sql/new\n');
            console.log(`
CREATE TABLE projects (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, phase TEXT NOT NULL, tags TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE backlog_ideas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, skills TEXT NOT NULL, author TEXT NOT NULL, votes INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE join_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE problems (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user" TEXT NOT NULL, problem TEXT NOT NULL, job_to_be_done TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON projects FOR ALL USING (true);
CREATE POLICY "public_all" ON backlog_ideas FOR ALL USING (true);
CREATE POLICY "public_all" ON join_requests FOR ALL USING (true);
CREATE POLICY "public_all" ON problems FOR ALL USING (true);
      `);
            return;
        } else if (!testError) {
            console.log('✓ Tables already exist!');

            // Insert sample project
            const { data, error } = await supabase.from('projects').insert({
                title: 'Welcome to 10,000 IDEAS',
                description: 'Your first project is live! Edit or add more projects in Supabase.',
                phase: 'Launch',
                tags: ['welcome', 'demo']
            }).select().single();

            if (data) {
                console.log('✓ Sample project created:', data.title);
            } else if (error) {
                console.log('Sample project not created:', error.message);
            }
        }
    } else {
        console.log('✓ Migration complete!');
    }
}

runMigration();
