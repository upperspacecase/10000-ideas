
import pg from 'pg';
const { Client } = pg;

const password = 'enotGE6bENnkVnJE';
const projectRef = 'gilyduulqfujbvjflibw';
const regionHost = 'aws-0-ap-southeast-2.pooler.supabase.com';

const configs = [
    {
        name: "Direct Alias (Standard)",
        url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
    },
    {
        name: "Pooler (Session Mode - Port 5432)",
        url: `postgresql://postgres.${projectRef}:${password}@${regionHost}:5432/postgres`
    },
    {
        name: "Pooler (Transaction Mode - Port 6543)",
        url: `postgresql://postgres.${projectRef}:${password}@${regionHost}:6543/postgres`
    }
];

async function testConnection(config) {
    console.log(`Testing: ${config.name}...`);
    // console.log(`URL: ${config.url}`); 

    const client = new Client({
        connectionString: config.url,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000 // 5s timeout
    });

    try {
        await client.connect();
        console.log(`✅ SUCCESS! Connected via ${config.name}`);

        // Try to run migration if connected
        await runMigration(client);

        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ FAILED ${config.name}: ${err.message}`);
        // console.log(err);
        await client.end();
        return false;
    }
}

async function runMigration(client) {
    console.log('Attempting to create tables...');
    const sql = `
    CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, phase TEXT NOT NULL, tags TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS backlog_ideas (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, skills TEXT NOT NULL, author TEXT NOT NULL, votes INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS join_requests (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID, name TEXT NOT NULL, email TEXT NOT NULL, role TEXT NOT NULL, message TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
    CREATE TABLE IF NOT EXISTS problems (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), "user" TEXT NOT NULL, problem TEXT NOT NULL, job_to_be_done TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
    
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public_all" ON projects;
    CREATE POLICY "public_all" ON projects FOR ALL USING (true);
    
    ALTER TABLE backlog_ideas ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public_all" ON backlog_ideas;
    CREATE POLICY "public_all" ON backlog_ideas FOR ALL USING (true);
    
    ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public_all" ON join_requests;
    CREATE POLICY "public_all" ON join_requests FOR ALL USING (true);
    
    ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "public_all" ON problems;
    CREATE POLICY "public_all" ON problems FOR ALL USING (true);
  `;

    await client.query(sql);
    console.log('✅ Tables created/verified!');

    const res = await client.query('SELECT count(*) FROM projects');
    if (res.rows[0].count === '0') {
        await client.query("INSERT INTO projects (title, description, phase, tags) VALUES ('Welcome to 10,000 IDEAS', 'Platform live!', 'Launch', ARRAY['welcome'])");
        console.log('✅ Sample data inserted!');
    }
}

async function run() {
    for (const config of configs) {
        const success = await testConnection(config);
        if (success) {
            console.log('\n🎉 Database setup complete! You can rely on this connection.');
            process.exit(0);
        }
    }
    console.log('\n❌ All connection attempts failed. Check firewall or Supabase project status.');
    process.exit(1);
}

run();
