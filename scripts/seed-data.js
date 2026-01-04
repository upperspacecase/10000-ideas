
import fetch from 'node-fetch';

const PROJECT_REF = 'gilyduulqfujbvjflibw';
const ACCESS_TOKEN = 'sbp_cd8b04a576c997febd86586ef28f35877f19b932';

async function seedData() {
    const sql = `
    -- Clear existing sample data if we want a fresh start (optional, maybe keep?) 
    -- DELETE FROM projects WHERE title != 'Welcome to 10,000 IDEAS';
    -- DELETE FROM backlog_ideas;
    
    -- Insert Projects
    INSERT INTO projects (title, description, phase, tags, needs, team_members, created_at) VALUES 
    (
      'NomadNest', 
      'A platform for digital nomads to find long-term stays with verified reliable internet speed. Includes community features for meetups.',
      'Development', 
      ARRAY['travel', 'saas', 'community'],
      ARRAY['React Developer', 'Marketing Lead'],
      '[{"name": "Sarah J.", "role": "PM"}, {"name": "Mike T.", "role": "Dev"}]'::jsonb,
      NOW() - INTERVAL '2 days'
    ),
    (
      'EcoScan AI', 
      'Mobile app that scans product barcodes to reveal their environmental impact and carbon footprint score. Suggests eco-friendly alternatives.',
      'Design', 
      ARRAY['mobile', 'ai', 'sustainability'],
      ARRAY['UI/UX Designer', 'Flutter Dev'],
      '[{"name": "Alex C.", "role": "Founder"}]'::jsonb,
      NOW() - INTERVAL '5 days'
    ),
    (
      'RetroSynth', 
      'Browser-based analog synthesizer emulator with collaborative jamming features using WebRTC.',
      'Ideation', 
      ARRAY['music', 'audio', 'web'],
      ARRAY['Audio Engineer', 'Frontend Dev'],
      '[]'::jsonb,
      NOW() - INTERVAL '10 days'
    ),
    (
      'LocalGrow', 
      'Marketplace connecting urban gardeners with local restaurants to sell excess produce.',
      'Launch', 
      ARRAY['marketplace', 'food', 'local'],
      ARRAY['Growth Hacker'],
      '[{"name": "Davide", "role": "Founder"}, {"name": "Jenny", "role": "Sales"}]'::jsonb,
      NOW() - INTERVAL '15 days'
    );

    -- Insert Backlog Ideas
    INSERT INTO backlog_ideas (title, description, category, skills, author, votes) VALUES
    (
      'AI Resume Builder',
      'An app that tailors your resume for specific job descriptions using LLMs to beat ATS systems.',
      'SaaS',
      'Next.js, OpenAI API',
      '@jobhunter_23',
      42
    ),
    (
      'Pet Sitter Match',
      'Tinder for finding pet sitters in your neighborhood. Swipe right on reliable walkers.',
      'Mobile App',
      'React Native, GeoLocation',
      '@doglover_99',
      28
    ),
    (
      'Focus Flow',
      'A minimalist pomodoro timer that blocks distracting websites at the DNS level.',
      'Tool',
      'Electron, System Programming',
      '@productivity_guru',
      15
    ),
    (
      'VR Museum Tours',
      'Platform for smaller museums to upload 3D scans of exhibits for virtual classroom tours.',
      'AR/VR',
      'Unity, WebGL',
      '@historybuff',
      36
    ),
    (
      'Crypto Tax Calculator',
      'Simple tool to calculate FIFO capital gains for obscure altcoins.',
      'Fintech',
      'Python, Math',
      '@cryptoking',
      9
    );

    -- Insert Problems
    INSERT INTO problems ("user", problem, job_to_be_done) VALUES
    (
      'Freelance Writer',
      'I spend 30% of my time chasing invoices and manually sending follow-up emails.',
      'When I complete a project, I want to automate billing, so I can focus on writing.'
    ),
    (
      'Gym Owner',
      'Managing class schedules and member renewals on spreadsheets is prone to errors.',
      'When a member signs up, I want auto-scheduling, so I don''t double-book classes.'
    ),
    (
      'Remote Manager',
      'It is hard to keep track of team morale without physical cues.',
      'When I lead a remote team, I want a daily sentiment pulse, so I can prevent burnout.'
    );
  `;

    console.log('Seeding data via Supabase Management API...');

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

        console.log('✅ Success! Mock data inserted.');
        const result = await response.json();
        console.log('Result:', result);

    } catch (error) {
        console.error('❌ Failed to seed data:', error.message);
    }
}

seedData();
