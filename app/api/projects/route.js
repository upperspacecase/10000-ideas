import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
        }

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const body = await request.json();

        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                title: body.title,
                description: body.description,
                url: body.url || null,
                phase: body.phase || 'Ideation',
                tags: body.tags || [],
                needs: body.needs || [],
                submitted_by: body.submitted_by || null
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
        }

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
