"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const STAGE_COLORS = {
  Ideation: "var(--stage-ideation)",
  Design: "var(--stage-design)",
  Development: "var(--stage-development)",
  Testing: "var(--stage-testing)",
  GTM: "var(--stage-gtm)",
  "Post-Launch": "var(--stage-launched)",
};

const STATUS_LABELS = {
  live: "Live",
  launching: "Launching",
  building: "Building",
  paused: "Paused",
};

function getStatus(project) {
  if (project.status) return project.status;
  if (project.phase === "Post-Launch") return "live";
  if (project.phase === "GTM") return "launching";
  return "building";
}

function CardImage({ project }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Screenshot the actual live site
  const src = project.url
    ? `/api/screenshot?url=${encodeURIComponent(project.url)}`
    : null;

  if (!src || errored) return null;

  return (
    <img
      src={src}
      alt=""
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}
    />
  );
}

export default function GalleryCarousel({ projects }) {
  const viewportRef = useRef(null);
  const stripRef = useRef(null);
  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rafId: null,
  });

  const cardWidth = 220;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const cards = stripRef.current?.children;
    if (!cards || cards.length === 0) return;

    if (!s.isDragging) {
      s.targetScroll += s.velocity;
      s.velocity *= 0.95;
      s.targetScroll += 0.5;
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.1;

    const totalSetWidth = projects.length * cardWidth;
    const winWidth = window.innerWidth;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let virtualIndex = i * cardWidth - s.currentScroll;

      while (virtualIndex < -totalSetWidth / 2) virtualIndex += totalSetWidth;
      while (virtualIndex > totalSetWidth / 2) virtualIndex -= totalSetWidth;

      if (Math.abs(virtualIndex) < winWidth) {
        card.style.display = "block";
        const progress = virtualIndex / (winWidth / 1.5);
        const x = virtualIndex;
        const z = -Math.pow(Math.abs(progress), 2) * 500;
        const rotateY = progress * 45;

        card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`;
        card.style.opacity = String(1 - Math.pow(Math.abs(progress), 3));
      } else {
        card.style.display = "none";
      }
    }

    s.rafId = requestAnimationFrame(animate);
  }, [projects.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || projects.length === 0) return;

    const s = stateRef.current;

    const onMouseDown = (e) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.velocity = 0;
      viewport.style.cursor = "grabbing";
    };

    const onMouseUp = () => {
      s.isDragging = false;
      viewport.style.cursor = "grab";
    };

    const onMouseMove = (e) => {
      if (!s.isDragging) return;
      const delta = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };

    const onTouchStart = (e) => {
      s.isDragging = true;
      s.lastX = e.touches[0].clientX;
      s.velocity = 0;
    };

    const onTouchEnd = () => {
      s.isDragging = false;
    };

    const onTouchMove = (e) => {
      if (!s.isDragging) return;
      const x = e.touches[0].clientX;
      const delta = x - s.lastX;
      s.lastX = x;
      s.targetScroll -= delta * 1.5;
      s.velocity = -delta * 0.5;
    };

    viewport.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    s.rafId = requestAnimationFrame(animate);

    return () => {
      viewport.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      viewport.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      if (s.rafId) cancelAnimationFrame(s.rafId);
    };
  }, [projects.length, animate]);

  return (
    <div
      ref={viewportRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vw",
        height: "40vh",
        perspective: "1200px",
        overflow: "visible",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={stripRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {projects.map((project, index) => {
          const status = getStatus(project);
          const stageColor =
            STAGE_COLORS[project.phase] || "var(--stage-development)";
          const formattedIndex = String(index + 1).padStart(2, "0");

          return (
            <a
              key={project.id}
              href={project.url || undefined}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (stateRef.current.isDragging) e.preventDefault();
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "200px",
                height: "260px",
                marginLeft: "-100px",
                marginTop: "-130px",
                background: stageColor,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                borderRadius: "var(--radius-lg)",
                color: "#fff",
                textDecoration: "none",
                overflow: "hidden",
                transition: "box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 60px rgba(0,0,0,0.2)";
                e.currentTarget.style.zIndex = "1000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 40px rgba(0,0,0,0.12)";
                e.currentTarget.style.zIndex = "auto";
              }}
            >
              {/* OG image background */}
              <CardImage project={project} />

              {/* Gradient overlay for text readability */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Content on top */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  padding: "var(--sp-md)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.6)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    {formattedIndex}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "2px 8px",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "var(--radius-full)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor:
                          status === "live"
                            ? "var(--success)"
                            : "rgba(255,255,255,0.6)",
                        boxShadow:
                          status === "live"
                            ? "0 0 6px var(--success)"
                            : "none",
                      }}
                    />
                    {STATUS_LABELS[status] || "Building"}
                  </span>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "17px",
                      fontWeight: 700,
                      lineHeight: 1.15,
                      margin: "0 0 6px 0",
                      letterSpacing: "-0.01em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  >
                    {project.title}
                  </h3>

                  {project.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        lineHeight: 1.4,
                        color: "rgba(255,255,255,0.85)",
                        margin: "0 0 8px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                      }}
                    >
                      {project.description}
                    </p>
                  )}

                  {project.phase && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "var(--radius-full)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {project.phase}
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
