import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('projects').get();

        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const projectData = {
            title: body.title,
            description: body.description,
            url: body.url || null,
            phase: body.phase || 'Ideation',
            status: body.status || 'building',
            launched_date: body.launched_date || null,
            audience: body.audience || null,
            model: body.model || null,
            mrr: body.mrr || '€0',
            metric1_value: body.metric1_value || null,
            metric1_label: body.metric1_label || 'users',
            metric2_value: body.metric2_value || null,
            metric2_label: body.metric2_label || 'visits/mo',
            wants_needs: body.wants_needs || [],
            blocker: body.blocker || null,
            owner_name: body.owner_name || 'Tay',
            is_todays_launch: body.is_todays_launch || false,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('projects').add(projectData);

        return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
