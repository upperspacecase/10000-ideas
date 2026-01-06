import { NextResponse } from 'next/server';
import { adminDb } from '@/libs/firebase-admin';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const doc = await adminDb.collection('projects').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Build update object with only provided fields
        const updateData = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.url !== undefined) updateData.url = body.url;
        if (body.phase !== undefined) updateData.phase = body.phase;
        if (body.is_todays_launch !== undefined) updateData.is_todays_launch = body.is_todays_launch;
        if (body.status !== undefined) updateData.status = body.status;
        if (body.launched_date !== undefined) updateData.launched_date = body.launched_date;
        if (body.audience !== undefined) updateData.audience = body.audience;
        if (body.model !== undefined) updateData.model = body.model;
        if (body.mrr !== undefined) updateData.mrr = body.mrr;
        if (body.metric1_value !== undefined) updateData.metric1_value = body.metric1_value;
        if (body.metric1_label !== undefined) updateData.metric1_label = body.metric1_label;
        if (body.metric2_value !== undefined) updateData.metric2_value = body.metric2_value;
        if (body.metric2_label !== undefined) updateData.metric2_label = body.metric2_label;
        if (body.wants_needs !== undefined) updateData.wants_needs = body.wants_needs;
        if (body.blocker !== undefined) updateData.blocker = body.blocker;
        if (body.owner_name !== undefined) updateData.owner_name = body.owner_name;

        await adminDb.collection('projects').doc(id).update(updateData);

        const updated = await adminDb.collection('projects').doc(id).get();
        return NextResponse.json({ id: updated.id, ...updated.data() });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await adminDb.collection('projects').doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
