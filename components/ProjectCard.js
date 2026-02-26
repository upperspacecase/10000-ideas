"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * ProjectCard – Netflix show-card / book-cover style with 3D flip on click.
 *
 * Front: bold gradient cover with title + status badge
 * Back:  project details (MRR, metrics, wants/needs, blocker, CTA)
 */

// Gradient palettes keyed by status
const GRADIENTS = {
    live: "linear-gradient(160deg, #00c853 0%, #009624 50%, #004d00 100%)",
    launching:
        "linear-gradient(160deg, #ffd600 0%, #ff9100 50%, #e65100 100%)",
    building:
        "linear-gradient(160deg, #304ffe 0%, #6200ea 50%, #aa00ff 100%)",
    paused:
        "linear-gradient(160deg, #546e7a 0%, #37474f 50%, #263238 100%)",
};

const STATUS_LABELS = {
    live: "Live",
    launching: "Launching",
    building: "Building",
    paused: "Paused",
};

const STATUS_DOTS = {
    live: "#00ff88",
    launching: "#ffd600",
    building: "#82b1ff",
    paused: "#90a4ae",
};

export default function ProjectCard({ project, index = 0 }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Derive status
    const getStatus = () => {
        if (project.status) return project.status;
        if (project.phase === "Post-Launch") return "live";
        if (project.phase === "GTM") return "launching";
        return "building";
    };

    const status = getStatus();
    const gradient = GRADIENTS[status] || GRADIENTS.building;
    const formattedIndex = String(index + 1).padStart(2, "0");

    // Data with fallbacks
    const mrr = project.mrr ?? "€0";
    const metric1Value = project.metric1_value || "—";
    const metric1Label = project.metric1_label || "users";
    const metric2Value = project.metric2_value || "—";
    const metric2Label = project.metric2_label || "visits/mo";
    const audience = project.audience || "—";
    const model = project.model || "—";
    const launchedDate = project.launched_date || "—";
    const wantsNeeds = project.wants_needs || [];
    const blocker = project.blocker || null;

    return (
        <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group"
            style={{
                perspective: "1200px",
                width: "220px",
                minWidth: "220px",
                height: "330px",
                cursor: "pointer",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* ─── FRONT FACE (Cover) ─── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        borderRadius: "16px",
                        background: gradient,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "20px",
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                    }}
                    className="transition-transform duration-300 group-hover:scale-[1.05]"
                >
                    {/* Top: Index */}
                    <span
                        style={{
                            fontFamily: "monospace",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "rgba(255,255,255,0.5)",
                        }}
                    >
                        {formattedIndex}
                    </span>

                    {/* Bottom: Title + Status */}
                    <div>
                        <h3
                            style={{
                                fontSize: "22px",
                                fontWeight: "700",
                                lineHeight: "1.15",
                                color: "#fff",
                                margin: "0 0 12px 0",
                                letterSpacing: "-0.02em",
                                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                            }}
                        >
                            {project.title}
                        </h3>

                        {project.description && (
                            <p
                                style={{
                                    fontSize: "12px",
                                    lineHeight: "1.4",
                                    color: "rgba(255,255,255,0.7)",
                                    margin: "0 0 12px 0",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {project.description}
                            </p>
                        )}

                        {/* Status badge */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "4px 10px",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "12px",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            <span
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: STATUS_DOTS[status] || STATUS_DOTS.building,
                                    boxShadow: `0 0 6px ${STATUS_DOTS[status] || STATUS_DOTS.building}`,
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "rgba(255,255,255,0.85)",
                                    letterSpacing: "0.03em",
                                }}
                            >
                                {STATUS_LABELS[status] || "Building"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── BACK FACE (Details) ─── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: "16px",
                        backgroundColor: "#FAF9F7",
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    }}
                >
                    {/* Title */}
                    <h4
                        style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            margin: "0 0 14px 0",
                            color: "#111",
                            letterSpacing: "-0.01em",
                            lineHeight: "1.2",
                        }}
                    >
                        {project.title}
                    </h4>

                    {/* Stats grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                            marginBottom: "14px",
                        }}
                    >
                        {[
                            { label: "MRR", value: mrr },
                            { label: metric1Label, value: metric1Value },
                            { label: metric2Label, value: metric2Value },
                            { label: "Audience", value: audience },
                            { label: "Model", value: model },
                            { label: "Launched", value: launchedDate },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div
                                    style={{
                                        fontSize: "9px",
                                        fontWeight: "600",
                                        color: "#999",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                        marginBottom: "2px",
                                    }}
                                >
                                    {label}
                                </div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#222",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Wants & Needs */}
                    {wantsNeeds.length > 0 && (
                        <div style={{ marginBottom: "10px" }}>
                            <div
                                style={{
                                    fontSize: "9px",
                                    fontWeight: "600",
                                    color: "#999",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    marginBottom: "6px",
                                }}
                            >
                                Needs
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {wantsNeeds.slice(0, 3).map((need, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: "3px 8px",
                                            backgroundColor: "rgba(0,0,0,0.06)",
                                            borderRadius: "8px",
                                            fontSize: "10px",
                                            fontWeight: "500",
                                            color: "#444",
                                        }}
                                    >
                                        {need}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blocker */}
                    {blocker && blocker !== "—" && (
                        <div
                            style={{
                                padding: "8px 10px",
                                backgroundColor: "rgba(239,68,68,0.1)",
                                borderRadius: "8px",
                                marginBottom: "10px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "9px",
                                    fontWeight: "700",
                                    color: "#EF4444",
                                    textTransform: "uppercase",
                                    marginBottom: "2px",
                                }}
                            >
                                Blocker
                            </div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#333",
                                    lineHeight: "1.3",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {blocker}
                            </div>
                        </div>
                    )}

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* CTA */}
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
                                gap: "6px",
                                padding: "10px",
                                backgroundColor: "#111",
                                color: "#fff",
                                borderRadius: "10px",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "600",
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
