/**
 * Migration script: Supabase → Firebase
 * 
 * Run with: node scripts/migrate-supabase-to-firebase.js
 */

const { createClient } = require('@supabase/supabase-js');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Supabase config (your old credentials)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Firebase Admin config
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function migrateProjects() {
    console.log('📦 Fetching projects from Supabase...');

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*');

    if (error) {
        console.error('❌ Supabase error:', error);
        return;
    }

    console.log(`✅ Found ${projects.length} projects`);

    for (const project of projects) {
        console.log(`  → Migrating: ${project.title}`);

        // Remove Supabase-specific fields, keep the rest
        const { id, ...projectData } = project;

        // Add to Firestore
        await db.collection('projects').add({
            ...projectData,
            _supabase_id: id, // Keep reference to original ID
            migrated_at: new Date()
        });
    }

    console.log('✅ Migration complete!');
}

migrateProjects().catch(console.error);
