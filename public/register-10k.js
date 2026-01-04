
/**
 * 10,000 IDEAS - Universal Registration Script
 * 
 * Usage: 
 * 1. Place this file in your project root (e.g. scripts/register-10k.js)
 * 2. Run it during your build/deploy process: 
 *    node scripts/register-10k.js
 * 
 * Note: Requires Node.js v18+ (for native fetch) or 'node-fetch' installed.
 */

const REGISTRY_ENDPOINT = 'http://localhost:3001/api/register-project'; // Update this to your production URL
const PROJECT_URL = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL || 'https://your-project-url.com';

async function register() {
    console.log(`🚀 Registering ${PROJECT_URL} with 10,000 IDEAS...`);

    try {
        // Ensure URL has protocol
        const url = PROJECT_URL.startsWith('http') ? PROJECT_URL : `https://${PROJECT_URL}`;

        const response = await fetch(REGISTRY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        console.log('✅ Successfully Registered!');
        console.log('📝 Title:', data.project.title);
        console.log('🔗 URL:', data.project.url);

    } catch (error) {
        console.error('❌ Registration Failed:', error.message);
        process.exit(1);
    }
}

register();
