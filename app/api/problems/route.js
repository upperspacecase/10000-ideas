import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function POST(request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const body = await request.json();
        const { user, problem, jobToBeDone } = body;

        if (!user || !problem || !jobToBeDone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data: newProblem, error } = await supabase
            .from('problems')
            .insert({
                user,
                problem,
                job_to_be_done: jobToBeDone,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating problem:', error);
            return NextResponse.json({ error: 'Failed to create problem submission' }, { status: 500 });
        }

        return NextResponse.json(newProblem, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
