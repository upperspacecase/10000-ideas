
import { NextResponse } from "next/server";
import { adminDb } from '@/libs/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
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
            status: "building"
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

            // 10k:phase -> e.g. "Launch", "Development"
            const phase = getMeta('10k:phase');
            if (phase) metadata.phase = phase;

        } catch (scrapeError) {
            console.error("Scraping failed:", scrapeError);
            metadata.title = url;
            metadata.description = "Imported from URL (Metadata scraping failed)";
        }

        // 2. Insert into Firestore
        const projectData = {
            title: metadata.title,
            description: metadata.description,
            url: metadata.url,
            image_url: metadata.image_url,
            phase: metadata.phase,
            status: metadata.status,
            created_at: FieldValue.serverTimestamp()
        };

        const docRef = await adminDb.collection('projects').add(projectData);

        return NextResponse.json({ success: true, project: { id: docRef.id, ...projectData } });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
