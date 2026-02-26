import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Vercel Deployment Webhook Handler
 *
 * Receives deployment events from Vercel and upserts project data into Firestore.
 * Verifies the request signature using HMAC-SHA1.
 *
 * Events handled:
 *   - deployment.created  → status: "building"
 *   - deployment.ready    → status: "live"
 *   - deployment.error    → status: "paused"
 */

// Map Vercel event types → project status
const EVENT_STATUS_MAP = {
    'deployment.created': 'building',
    'deployment.ready': 'live',
    'deployment.succeeded': 'live',
    'deployment.error': 'paused',
    'deployment.canceled': 'paused',
};

// Map Vercel target → project phase
const TARGET_PHASE_MAP = {
    production: 'Post-Launch',
    staging: 'Testing',
};

/**
 * Convert kebab-case project name to Title Case
 * e.g. "my-cool-project" → "My Cool Project"
 */
function prettifyProjectName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Verify Vercel webhook signature (HMAC-SHA1)
 */
function verifySignature(rawBody, signature, secret) {
    const computed = createHmac('sha1', secret)
        .update(rawBody)
        .digest('hex');
    return computed === signature;
}

export async function POST(request) {
    try {
        const secret = process.env.VERCEL_WEBHOOK_SECRET;

        if (!secret) {
            console.error('VERCEL_WEBHOOK_SECRET is not configured');
            return NextResponse.json(
                { error: 'Webhook secret not configured' },
                { status: 500 }
            );
        }

        // Read raw body for signature verification
        const rawBody = await request.text();
        const signature = request.headers.get('x-vercel-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 401 }
            );
        }

        // Verify HMAC-SHA1 signature
        if (!verifySignature(rawBody, signature, secret)) {
            console.error('Webhook signature verification failed');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse the event
        const event = JSON.parse(rawBody);
        const eventType = event.type;
        const payload = event.payload;

        // Only handle deployment events we care about
        const newStatus = EVENT_STATUS_MAP[eventType];
        if (!newStatus) {
            // Event type we don't handle — acknowledge and move on
            return NextResponse.json({ received: true, action: 'ignored' });
        }

        const {
            projectId: vercelProjectId,
            projectName,
            url: deploymentUrl,
            deploymentId,
            target,
        } = payload;

        if (!vercelProjectId) {
            return NextResponse.json(
                { error: 'Missing projectId in payload' },
                { status: 400 }
            );
        }

        // Query Firestore for existing project with this vercel_project_id
        const projectsRef = adminDb.collection('projects');
        const snapshot = await projectsRef
            .where('vercel_project_id', '==', vercelProjectId)
            .limit(1)
            .get();

        const fullUrl = deploymentUrl
            ? `https://${deploymentUrl}`
            : null;

        if (!snapshot.empty) {
            // ─── UPDATE existing project ───
            const doc = snapshot.docs[0];
            const updateData = {
                status: newStatus,
                vercel_deployment_id: deploymentId || null,
                deployed_at: event.createdAt
                    ? new Date(event.createdAt).toISOString()
                    : FieldValue.serverTimestamp(),
                updated_at: FieldValue.serverTimestamp(),
            };

            // Only update URL if this is a production deployment
            if (target === 'production' && fullUrl) {
                updateData.url = fullUrl;
                updateData.vercel_deployment_url = fullUrl;
            }

            // Update phase if target is known
            if (target && TARGET_PHASE_MAP[target]) {
                updateData.phase = TARGET_PHASE_MAP[target];
            }

            await doc.ref.update(updateData);

            console.log(
                `[Vercel Webhook] Updated project "${projectName}" (${vercelProjectId}) → ${newStatus}`
            );

            return NextResponse.json({
                received: true,
                action: 'updated',
                projectId: doc.id,
                status: newStatus,
            });
        } else {
            // ─── CREATE new project ───
            const newProject = {
                title: prettifyProjectName(projectName || 'Untitled'),
                description: null,
                url: fullUrl,
                phase: TARGET_PHASE_MAP[target] || 'Development',
                status: newStatus,
                launched_date: newStatus === 'live'
                    ? new Date().toISOString().split('T')[0]
                    : null,
                audience: null,
                model: null,
                mrr: '€0',
                metric1_value: null,
                metric1_label: 'users',
                metric2_value: null,
                metric2_label: 'visits/mo',
                wants_needs: [],
                blocker: null,
                owner_name: 'Tay',
                is_todays_launch: false,
                // Vercel-specific fields
                vercel_project_id: vercelProjectId,
                vercel_deployment_id: deploymentId || null,
                vercel_deployment_url: fullUrl,
                deployed_at: event.createdAt
                    ? new Date(event.createdAt).toISOString()
                    : null,
                created_at: FieldValue.serverTimestamp(),
                updated_at: FieldValue.serverTimestamp(),
            };

            const docRef = await projectsRef.add(newProject);

            console.log(
                `[Vercel Webhook] Created project "${newProject.title}" (${vercelProjectId}) → ${newStatus}`
            );

            return NextResponse.json(
                {
                    received: true,
                    action: 'created',
                    projectId: docRef.id,
                    status: newStatus,
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('[Vercel Webhook] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
