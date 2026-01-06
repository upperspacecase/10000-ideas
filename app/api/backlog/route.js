import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('backlog_ideas').orderBy('votes', 'desc').get();

        const backlogIdeas = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(backlogIdeas);
    } catch (error) {
        console.error('Error fetching backlog ideas:', error);
        return NextResponse.json({ error: 'Failed to fetch backlog ideas' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, description, category, skills, author } = body;

        if (!title || !description || !category || !skills || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ideaData = {
            title,
            description,
            category,
            skills,
            author,
            votes: 1,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('backlog_ideas').add(ideaData);

        return NextResponse.json({ id: docRef.id, ...ideaData }, { status: 201 });
    } catch (error) {
        console.error('Error creating backlog idea:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
