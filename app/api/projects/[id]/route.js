import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function GET(request, { params }) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            console.error('Error fetching project:', error);
            return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const body = await request.json();

        // Build update object with only provided fields
        const updateData = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.url !== undefined) updateData.url = body.url;
        if (body.phase !== undefined) updateData.phase = body.phase;
        if (body.tags !== undefined) updateData.tags = body.tags;
        if (body.needs !== undefined) updateData.needs = body.needs;
        if (body.is_todays_launch !== undefined) updateData.is_todays_launch = body.is_todays_launch;

        const { data: project, error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating project:', error);
            return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('Error deleting project:', error);
            return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
