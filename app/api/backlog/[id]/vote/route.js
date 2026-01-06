import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const docRef = adminDb.collection('backlog_ideas').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Backlog idea not found' }, { status: 404 });
        }

        const currentVotes = doc.data().votes || 0;
        await docRef.update({ votes: currentVotes + 1 });

        const updated = await docRef.get();
        return NextResponse.json({ id: updated.id, ...updated.data() });
    } catch (error) {
        console.error('Error voting:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
