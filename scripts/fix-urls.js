// One-time script: resolve Vercel preview URLs to production aliases
// Usage: node scripts/fix-urls.js

import { execSync } from "child_process";

const API = "http://localhost:3002";

// 1. Fetch all projects
const res = await fetch(`${API}/api/projects`);
const projects = await res.json();

if (!Array.isArray(projects)) {
  console.error("Failed to fetch projects");
  process.exit(1);
}

const vercelProjects = projects.filter(
  (p) => p.url && p.url.includes("vercel.app")
);

console.log(`Resolving ${vercelProjects.length} Vercel URLs...\n`);

const updates = [];
let count = 0;

for (const project of vercelProjects) {
  count++;
  const hostname = new URL(project.url).hostname;

  try {
    const output = execSync(`vercel inspect "${hostname}" 2>&1`, {
      timeout: 15000,
      encoding: "utf-8",
    });

    // Extract all alias URLs
    const aliasSection = output.split("Aliases")[1] || "";
    const aliases = aliasSection
      .split("\n")
      .map((l) => l.replace(/[╶\s]/g, "").trim())
      .filter((l) => l.startsWith("https://"));

    // Pick the best production alias:
    // 1. Prefer custom domains (not .vercel.app)
    // 2. Then shortest .vercel.app alias without -git- or -taytodd
    const customDomain = aliases.find((a) => !a.includes("vercel.app"));
    const cleanVercel = aliases
      .filter((a) => !a.includes("-git-") && !a.includes("-taytodd"))
      .filter((a) => a.includes("vercel.app"))
      .sort((a, b) => a.length - b.length)[0];

    const productionUrl = customDomain || cleanVercel || null;

    if (productionUrl && productionUrl !== project.url) {
      console.log(
        `[${count}/${vercelProjects.length}] ${project.title}\n  ${project.url}\n  -> ${productionUrl}\n`
      );
      updates.push({ id: project.id, title: project.title, url: productionUrl });
    } else {
      process.stdout.write(
        `[${count}/${vercelProjects.length}] ${project.title} -- ${productionUrl ? "OK" : "no alias"}\n`
      );
    }
  } catch (err) {
    process.stdout.write(
      `[${count}/${vercelProjects.length}] ${project.title} -- ERROR\n`
    );
  }
}

console.log(`\n=== ${updates.length} URLs to update ===\n`);

if (updates.length === 0) {
  process.exit(0);
}

// 2. Update Firestore via PATCH
let success = 0;
for (const { id, title, url } of updates) {
  try {
    const r = await fetch(`${API}/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (r.ok) {
      success++;
    } else {
      console.error(`Failed ${title}: ${r.status}`);
    }
  } catch (err) {
    console.error(`Failed ${title}: ${err.message}`);
  }
}

console.log(`\nDone. Updated ${success}/${updates.length} projects.`);
