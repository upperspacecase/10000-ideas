import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const { data: backlogIdeas, error } = await supabase
            .from('backlog_ideas')
            .select('*')
            .order('votes', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching backlog ideas:', error);
            return NextResponse.json({ error: 'Failed to fetch backlog ideas' }, { status: 500 });
        }

        return NextResponse.json(backlogIdeas);
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
        const { title, description, category, skills, author } = body;

        if (!title || !description || !category || !skills || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data: newIdea, error } = await supabase
            .from('backlog_ideas')
            .insert({ title, description, category, skills, author, votes: 1 })
            .select()
            .single();

        if (error) {
            console.error('Error creating backlog idea:', error);
            return NextResponse.json({ error: 'Failed to create backlog idea' }, { status: 500 });
        }

        return NextResponse.json(newIdea, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
