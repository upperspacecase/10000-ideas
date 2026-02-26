/**
 * Test script to simulate a Vercel deployment webhook event.
 * 
 * Usage:
 *   node scripts/test-webhook.js
 * 
 * Requires VERCEL_WEBHOOK_SECRET in .env.local
 */

import { createHmac } from 'crypto';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const WEBHOOK_URL = 'http://localhost:3000/api/webhook/vercel';
const SECRET = process.env.VERCEL_WEBHOOK_SECRET;

if (!SECRET) {
    console.error('❌ VERCEL_WEBHOOK_SECRET not found in .env.local');
    process.exit(1);
}

// Simulated Vercel deployment.created event
const payload = {
    type: 'deployment.created',
    createdAt: new Date().toISOString(),
    payload: {
        projectId: 'test-project-' + Date.now(),
        projectName: 'webhook-test-project',
        name: 'webhook-test-project',
        url: 'webhook-test-project.vercel.app',
        deploymentId: 'dpl_test_' + Date.now(),
        target: 'production',
    },
};

const body = JSON.stringify(payload);

// Sign with HMAC-SHA1 (same as Vercel does)
const signature = createHmac('sha1', SECRET).update(body).digest('hex');

console.log('📡 Sending simulated deployment.created event...');
console.log(`   Project: ${payload.payload.projectName}`);
console.log(`   URL: ${WEBHOOK_URL}`);
console.log(`   Signature: ${signature.slice(0, 12)}...`);
console.log('');

try {
    const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-vercel-signature': signature,
        },
        body,
    });

    const data = await res.json();

    if (res.ok) {
        console.log(`✅ Webhook responded ${res.status}:`);
        console.log(JSON.stringify(data, null, 2));

        if (data.action === 'created') {
            console.log(`\n🎉 Project created with ID: ${data.projectId}`);
        } else if (data.action === 'updated') {
            console.log(`\n🔄 Project updated: ${data.projectId}`);
        }

        // Verify project appears in /api/projects
        console.log('\n📋 Fetching all projects to verify...');
        const projectsRes = await fetch('http://localhost:3000/api/projects');
        const projects = await projectsRes.json();
        const found = Array.isArray(projects)
            ? projects.find(p => p.id === data.projectId)
            : null;

        if (found) {
            console.log(`✅ Project "${found.title}" found in project list`);
        } else {
            console.log('⚠️  Project not found in list (may take a moment for Firestore to sync)');
        }
    } else {
        console.error(`❌ Webhook responded ${res.status}:`);
        console.error(JSON.stringify(data, null, 2));
    }
} catch (err) {
    console.error('❌ Failed to reach webhook:', err.message);
    console.error('   Is the dev server running? (npm run dev)');
}
