import { NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";

// In-memory cache to avoid re-screenshotting the same URL
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

async function getBrowser() {
  // Local dev: use system Chrome
  const possiblePaths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ];

  let executablePath = null;

  if (process.env.NODE_ENV === "production") {
    // Serverless: use @sparticuz/chromium
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  // Local: find system Chrome
  const fs = await import("fs");
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    throw new Error("No Chrome/Chromium found locally");
  }

  return puppeteerCore.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1280, height: 720 },
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(cached.buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  let browser = null;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    });

    // Check if we landed on a Vercel login page or got a non-OK status
    const status = response?.status() || 0;
    const pageTitle = await page.title();

    const titleLower = pageTitle.toLowerCase();
    if (
      status === 401 ||
      status === 403 ||
      status === 404 ||
      titleLower.includes("log in to vercel") ||
      titleLower.includes("vercel - login") ||
      titleLower === "404: this page could not be found" ||
      titleLower.includes("page not found") ||
      titleLower === "" ||
      titleLower === "vercel"
    ) {
      await browser.close();
      return NextResponse.json(
        { error: "Page not publicly accessible" },
        { status: 404 }
      );
    }

    // Wait a moment for any animations/lazy content
    await new Promise((r) => setTimeout(r, 1500));

    const screenshot = await page.screenshot({ type: "png" });
    await browser.close();
    browser = null;

    // Cache it
    cache.set(url, { buffer: screenshot, timestamp: Date.now() });

    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Screenshot error:", error.message);
    if (browser) await browser.close();
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
