"use client";

import { useState, useEffect } from "react";
import GalleryCarousel from "@/components/GalleryCarousel";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_GAP,
  CARD_RADIUS,
  FEATURED_WIDTH,
} from "@/components/gallery-constants";

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

      {/* Featured project banner */}
      {(() => {
        const featured = projects.find((p) => p.is_todays_launch);
        if (!featured) return null;
        return (
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              padding: "0 20px",
              zIndex: 100,
            }}
          >
            <a
              href={featured.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: `${FEATURED_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                borderRadius: CARD_RADIUS,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <img
                src={featured.featured_image || `/api/screenshot?url=${encodeURIComponent(featured.url)}`}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "var(--accent)",
                    borderRadius: CARD_RADIUS,
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  Featured
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 700,
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {featured.title}
                </span>
              </div>
            </a>
          </div>
        );
      })()}

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
        <a
          href="mailto:hi@life-time.co"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 32px",
            backgroundColor: "var(--text-primary)",
            color: "var(--bg)",
            borderRadius: CARD_RADIUS,
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            minHeight: "44px",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Work With Us
        </a>
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
