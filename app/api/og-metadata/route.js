import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; 10kIdeasBot/1.0)'
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 500 });
        }

        const html = await response.text();

        // Extract Open Graph image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

        // Extract title
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
            html.match(/<title[^>]*>([^<]+)<\/title>/i);

        // Extract description
        const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i) ||
            html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);

        // Extract favicon
        const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i) ||
            html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i);

        let favicon = faviconMatch ? faviconMatch[1] : null;
        if (favicon && !favicon.startsWith('http')) {
            const urlObj = new URL(url);
            favicon = favicon.startsWith('/')
                ? `${urlObj.origin}${favicon}`
                : `${urlObj.origin}/${favicon}`;
        }

        return NextResponse.json({
            image: ogImageMatch ? ogImageMatch[1] : null,
            title: ogTitleMatch ? ogTitleMatch[1] : null,
            description: ogDescMatch ? ogDescMatch[1] : null,
            favicon
        });

    } catch (error) {
        console.error('Error fetching metadata:', error);
        return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
    }
}
