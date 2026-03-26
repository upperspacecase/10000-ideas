"use client";

import { useState, useEffect } from "react";
import GalleryCarousel from "@/components/GalleryCarousel";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, []);

  return (
    <main
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "relative",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          10,000 IDEAS
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: "10px",
            color: "var(--text-muted)",
            lineHeight: 1.4,
            fontFamily: "var(--font-mono)",
          }}
        >
          OPEN-SOURCE
          <br />
          VENTURE STUDIO
        </div>
      </header>

      {/* Gallery -- fills the middle */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <GalleryCarousel projects={projects} />
      </div>

      {/* CTA -- always visible at bottom */}
      <div
        style={{
          position: "relative",
          zIndex: 200,
          flexShrink: 0,
          padding: "12px 20px 24px",
          display: "flex",
          justifyContent: "center",
          opacity: loading ? 0 : 1,
          transition: "opacity 2s ease",
        }}
      >
        <div style={{ width: "100%", maxWidth: "320px", textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "12px",
              color: "var(--text-muted)",
              display: "block",
            }}
          >
            Work With Us
          </span>
          <a
            href="mailto:hi@life-time.co"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid var(--border-strong)",
              paddingBottom: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "16px",
              color: "var(--text-primary)",
              textDecoration: "none",
              minHeight: "44px",
            }}
          >
            hi@life-time.co
          </a>
        </div>
      </div>

      {/* Loading overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "var(--bg)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: loading ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          pointerEvents: loading ? "auto" : "none",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.2em",
            animation: "pulse 2s infinite",
          }}
        >
          INITIALIZING GALLERY...
        </div>
      </div>
    </main>
  );
}
