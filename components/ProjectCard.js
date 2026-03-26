"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

// Stage colors (flat solids per DESIGN.md)
const STAGE_COLORS = {
  live: "var(--stage-testing)",
  launching: "var(--stage-ideation)",
  building: "var(--stage-development)",
  paused: "#546E7A",
};

const STATUS_LABELS = {
  live: "Live",
  launching: "Launching",
  building: "Building",
  paused: "Paused",
};

export default function ProjectCard({ project, index = 0 }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getStatus = () => {
    if (project.status) return project.status;
    if (project.phase === "Post-Launch") return "live";
    if (project.phase === "GTM") return "launching";
    return "building";
  };

  const status = getStatus();
  const stageColor = STAGE_COLORS[status] || STAGE_COLORS.building;
  const formattedIndex = String(index + 1).padStart(2, "0");

  const mrr = project.mrr ?? "---";
  const metric1Value = project.metric1_value || "---";
  const metric1Label = project.metric1_label || "users";
  const metric2Value = project.metric2_value || "---";
  const metric2Label = project.metric2_label || "visits/mo";
  const audience = project.audience || "---";
  const model = project.model || "---";
  const launchedDate = project.launched_date || "---";
  const wantsNeeds = project.wants_needs || [];
  const blocker = project.blocker || null;

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
      role="button"
      tabIndex={0}
      aria-label={`${project.title} - ${STATUS_LABELS[status] || "Building"}. Click to ${isFlipped ? 'hide' : 'show'} details.`}
      className="group"
      style={{
        perspective: "1200px",
        width: "200px",
        minWidth: "200px",
        height: "280px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform var(--duration-long, 600ms) cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "var(--radius-lg)",
            background: stageColor,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "var(--sp-md)",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          }}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
          }}>
            {formattedIndex}
          </span>

          <div>
            <h3 style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#fff",
              margin: "0 0 var(--sp-sm) 0",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              {project.title}
            </h3>

            {project.description && (
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 var(--sp-sm) 0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {project.description}
              </p>
            )}

            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-xs)",
              padding: "3px 10px",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: "var(--radius-full)",
            }}>
              <span style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.03em",
              }}>
                {STATUS_LABELS[status] || "Building"}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--bg-elevated)",
            display: "flex",
            flexDirection: "column",
            padding: "var(--sp-md)",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 700,
            margin: "0 0 var(--sp-md) 0",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}>
            {project.title}
          </h4>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sp-sm)",
            marginBottom: "var(--sp-md)",
          }}>
            {[
              { label: "MRR", value: mrr },
              { label: metric1Label, value: metric1Value },
              { label: metric2Label, value: metric2Value },
              { label: "Audience", value: audience },
              { label: "Model", value: model },
              { label: "Launched", value: launchedDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "var(--sp-2xs)",
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {wantsNeeds.length > 0 && (
            <div style={{ marginBottom: "var(--sp-sm)" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "var(--sp-xs)",
              }}>
                Needs
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-xs)" }}>
                {wantsNeeds.slice(0, 3).map((need, i) => (
                  <span key={i} style={{
                    padding: "3px var(--sp-sm)",
                    backgroundColor: "var(--bg-surface)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}>
                    {need}
                  </span>
                ))}
              </div>
            </div>
          )}

          {blocker && blocker !== "---" && (
            <div style={{
              padding: "var(--sp-sm)",
              backgroundColor: "rgba(239,68,68,0.08)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--sp-sm)",
            }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--error)",
                textTransform: "uppercase",
                marginBottom: "var(--sp-2xs)",
              }}>
                Blocker
              </div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "var(--text-primary)",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {blocker}
              </div>
            </div>
          )}

          <div style={{ flex: 1 }} />

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--sp-xs)",
                padding: "var(--sp-sm)",
                backgroundColor: "var(--text-primary)",
                color: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 600,
                transition: "opacity var(--duration-short) var(--ease-out)",
              }}
            >
              Visit Project <ExternalLink style={{ width: 12, height: 12 }} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
