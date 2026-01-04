import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function POST(request, { params }) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const { data: idea, error: fetchError } = await supabase
            .from('backlog_ideas')
            .select('votes')
            .eq('id', params.id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({ error: 'Backlog idea not found' }, { status: 404 });
            }
            console.error('Error fetching backlog idea:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch backlog idea' }, { status: 500 });
        }

        const { data: updatedIdea, error: updateError } = await supabase
            .from('backlog_ideas')
            .update({ votes: idea.votes + 1 })
            .eq('id', params.id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating vote count:', updateError);
            return NextResponse.json({ error: 'Failed to update vote count' }, { status: 500 });
        }

        return NextResponse.json(updatedIdea);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
