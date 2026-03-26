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

function CardImage({ url }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const src = url
    ? `/api/screenshot?url=${encodeURIComponent(url)}`
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
  const buttonsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const stateRef = useRef({
    currentScroll: 0,
    targetScroll: 0,
    isDragging: false,
    lastX: 0,
    velocity: 0,
    rafId: null,
  });

  const cardWidth = 220;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const animate = useCallback(() => {
    const s = stateRef.current;
    const cards = stripRef.current?.children;
    if (!cards || cards.length === 0) return;

    if (!s.isDragging) {
      s.targetScroll += s.velocity;
      s.velocity *= 0.95;
      s.targetScroll += 0.5; // auto-scroll
    }

    s.currentScroll += (s.targetScroll - s.currentScroll) * 0.1;

    const totalSetWidth = projects.length * cardWidth;
    const winWidth = window.innerWidth;

    const cardDistances = [];

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

        cardDistances.push({ index: i, distance: Math.abs(virtualIndex) });
      } else {
        card.style.display = "none";
      }
    }

    // Update buttons directly in the DOM for instant sync
    cardDistances.sort((a, b) => a.distance - b.distance);
    const mobile = window.innerWidth < 640;
    const top = cardDistances
      .slice(0, mobile ? 1 : 3)
      .sort((a, b) => a.index - b.index);
    const container = buttonsRef.current;
    if (container) {
      const buttons = container.children;
      for (let b = 0; b < buttons.length; b++) {
        const btn = buttons[b];
        const entry = top[b];
        if (entry) {
          const p = projects[entry.index];
          const color = STAGE_COLORS[p.phase] || "var(--stage-development)";
          btn.textContent = p.title;
          btn.href = p.url || "#";
          btn.style.backgroundColor = color;
          btn.style.display = "block";
          btn.setAttribute("aria-label", `Visit ${p.title}`);
        } else {
          btn.style.display = "none";
        }
      }
    }

    s.rafId = requestAnimationFrame(animate);
  }, [projects]);

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

  const buttonStyle = {
    display: "none",
    padding: "12px 16px",
    backgroundColor: "var(--stage-development)",
    borderRadius: "var(--radius-full)",
    color: "#fff",
    textDecoration: "none",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    minHeight: "44px",
    lineHeight: "20px",
    width: isMobile ? "100%" : 160,
  };

  return (
    <>
      {/* Carousel viewport -- fills parent */}
      <div
        ref={viewportRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100vw",
          height: "100%",
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
          {projects.map((project) => {
            const stageColor =
              STAGE_COLORS[project.phase] || "var(--stage-development)";
            const liveUrl = project.url || null;

            return (
              <div
                key={project.id}
                role="link"
                tabIndex={0}
                onPointerDown={(e) => {
                  e.currentTarget.dataset.downX = e.clientX;
                  e.currentTarget.dataset.downY = e.clientY;
                }}
                onPointerUp={(e) => {
                  const dx = Math.abs(
                    e.clientX - Number(e.currentTarget.dataset.downX || 0)
                  );
                  const dy = Math.abs(
                    e.clientY - Number(e.currentTarget.dataset.downY || 0)
                  );
                  if (dx < 10 && dy < 10 && liveUrl) {
                    window.open(liveUrl, "_blank", "noopener,noreferrer");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && liveUrl) {
                    window.open(liveUrl, "_blank", "noopener,noreferrer");
                  }
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
                <CardImage url={liveUrl} />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 100%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: "100%",
                    padding: "var(--sp-md)",
                  }}
                >
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
                          backgroundColor: stageColor,
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons below carousel -- updated directly from animation loop */}
      <div
        ref={buttonsRef}
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "var(--sp-sm)",
          zIndex: 200,
          width: isMobile ? "calc(100% - 40px)" : "auto",
          justifyContent: "center",
        }}
      >
        <a href="#" target="_blank" rel="noopener noreferrer" style={buttonStyle}> </a>
        {!isMobile && <a href="#" target="_blank" rel="noopener noreferrer" style={buttonStyle}> </a>}
        {!isMobile && <a href="#" target="_blank" rel="noopener noreferrer" style={buttonStyle}> </a>}
      </div>
    </>
  );
}
