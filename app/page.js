"use client";

import { useState, useEffect } from "react";
import GalleryCarousel from "@/components/GalleryCarousel";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert("You have been added to the queue.");
    setEmail("");
  };

  return (
    <main
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-mono)",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          zIndex: 100,
          pointerEvents: "none",
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

      {/* Gallery */}
      <GalleryCarousel projects={projects} />

      {/* Waitlist */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "320px",
          textAlign: "center",
          zIndex: 200,
          opacity: loading ? 0 : 1,
          transition: "opacity 2s ease",
        }}
      >
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
          Request Access
        </span>
        <form
          onSubmit={handleSubscribe}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid var(--border-strong)",
            paddingBottom: "8px",
          }}
        >
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="waitlist-email"
            type="email"
            placeholder="email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--text-primary)",
              paddingRight: "40px",
            }}
          />
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-primary)",
              position: "absolute",
              right: 0,
              opacity: 0.5,
            }}
          >
            Join
          </button>
        </form>
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
