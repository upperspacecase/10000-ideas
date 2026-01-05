import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabase';

export async function GET() {
    try {
        if (!supabase) {
            console.error('GET: Supabase client is null');
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
    console.log('=== POST /api/projects START ===');

    try {
        if (!supabase) {
            console.error('POST: Supabase client is null - check env vars');
            return NextResponse.json({
                error: 'Database not configured',
                hint: 'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY may be missing'
            }, { status: 503 });
        }

        const body = await request.json();
        console.log('POST body:', JSON.stringify(body, null, 2));

        const insertData = {
            title: body.title,
            description: body.description,
            url: body.url || null,
            phase: body.phase || 'Ideation',
            tags: body.tags || [],
            needs: body.needs || [],
            // New fields
            status: body.status || 'building',
            launched_date: body.launched_date || null,
            audience: body.audience || null,
            model: body.model || null,
            mrr: body.mrr || '€0',
            metric1_value: body.metric1_value || null,
            metric1_label: body.metric1_label || 'users',
            metric2_value: body.metric2_value || null,
            metric2_label: body.metric2_label || 'visits/mo',
            wants_needs: body.wants_needs || [],
            blocker: body.blocker || null,
            owner_name: body.owner_name || 'Tay'
        };

        console.log('Insert data:', JSON.stringify(insertData, null, 2));

        const { data: project, error } = await supabase
            .from('projects')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', JSON.stringify(error, null, 2));
            return NextResponse.json({
                error: 'Failed to create project',
                supabaseError: error.message,
                code: error.code,
                details: error.details
            }, { status: 500 });
        }

        console.log('=== POST SUCCESS ===', project.id);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('POST exception:', error.message, error.stack);
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 500 });
    }
}
