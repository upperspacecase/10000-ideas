
import fetch from 'node-fetch';

const PROJECT_REF = 'gilyduulqfujbvjflibw';
const ACCESS_TOKEN = 'sbp_cd8b04a576c997febd86586ef28f35877f19b932';

async function runMigration() {
  const sql = `
    ALTER TABLE projects 
    ADD COLUMN IF NOT EXISTS url TEXT,
    ADD COLUMN IF NOT EXISTS image_url TEXT;
  `;

  console.log('Applying schema migration via Supabase Management API...');

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

    console.log('✅ Success! Schema updated.');

    // Log resulting columns just to be sure
    const checkSql = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects';
    `;

    // We can run a second query to verify if we want, but let's just trust the ALTER TABLE for now.

  } catch (error) {
    console.error('❌ Failed to migrate schema:', error.message);
  }
}

runMigration();
