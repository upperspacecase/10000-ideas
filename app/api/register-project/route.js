
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from 'cheerio';

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // 1. Scrape Metadata
        let metadata = {
            title: "",
            description: "",
            image_url: "",
            url: url,
            phase: "Ideation",
            tags: ["imported"],
            needs: []
        };

        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; 10000IdeasBot/1.0;)'
                }
            });
            const html = await response.text();
            const $ = cheerio.load(html);

            // Helper to get meta content
            const getMeta = (name) => {
                return $(`meta[property="${name}"]`).attr('content') ||
                    $(`meta[name="${name}"]`).attr('content') || "";
            };

            // Standard OG Metadata
            metadata.title = getMeta('og:title') || $('title').text() || url;
            metadata.description = getMeta('og:description') || getMeta('description') || "No description available.";
            metadata.image_url = getMeta('og:image') || "";

            // Advanced 10k Specific Tags
            // 10k:phase -> e.g. "Launch", "Development"
            const phase = getMeta('10k:phase');
            if (phase) metadata.phase = phase;

            // 10k:tags -> e.g. "AI, SaaS, Mobile"
            const tagsStr = getMeta('10k:tags') || getMeta('keywords');
            if (tagsStr) {
                metadata.tags = tagsStr.split(',').map(s => s.trim()).filter(s => s);
            }

            // 10k:needs -> e.g. "React Developer, Designer"
            const needsStr = getMeta('10k:needs');
            if (needsStr) {
                metadata.needs = needsStr.split(',').map(s => s.trim()).filter(s => s);
            }

        } catch (scrapeError) {
            console.error("Scraping failed:", scrapeError);
            metadata.title = url;
            metadata.description = "Imported from URL (Metadata scraping failed)";
        }

        // 2. Insert into Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data, error } = await supabase
            .from("projects")
            .insert([
                {
                    title: metadata.title,
                    description: metadata.description,
                    url: metadata.url,
                    image_url: metadata.image_url,
                    phase: metadata.phase,
                    tags: metadata.tags,
                    needs: metadata.needs,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, project: data[0] });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
