import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { projectId, name, email, role, message } = body;

        if (!projectId || !name || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const requestData = {
            project_id: projectId,
            name,
            email,
            role,
            message: message || null,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('join_requests').add(requestData);

        return NextResponse.json({ id: docRef.id, ...requestData }, { status: 201 });
    } catch (error) {
        console.error('Error creating join request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
