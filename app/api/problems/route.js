import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
    try {
        const body = await request.json();
        const { user, problem, jobToBeDone } = body;

        if (!user || !problem || !jobToBeDone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const problemData = {
            user,
            problem,
            job_to_be_done: jobToBeDone,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('problems').add(problemData);

        return NextResponse.json({ id: docRef.id, ...problemData }, { status: 201 });
    } catch (error) {
        console.error('Error creating problem:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
