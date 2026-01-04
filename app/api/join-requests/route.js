import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function POST(request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const body = await request.json();
        const { projectId, name, email, role, message } = body;

        if (!projectId || !name || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const { data: joinRequest, error } = await supabase
            .from('join_requests')
            .insert({
                project_id: projectId,
                name,
                email,
                role,
                message: message || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating join request:', error);
            return NextResponse.json({ error: 'Failed to create join request' }, { status: 500 });
        }

        return NextResponse.json(joinRequest, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
