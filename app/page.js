"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "@/components/ProjectCard";
import { toast } from "react-hot-toast";

// ─── Stage configuration (flat colors per DESIGN.md) ───
const SECTIONS = [
  { id: "hero", label: "10K Ideas", stageColor: "var(--stage-hero)" },
  { id: "manifesto", label: "Manifesto", stageColor: "var(--stage-manifesto)" },
  { id: "ideation", label: "Ideation", phase: "Ideation", stageColor: "var(--stage-ideation)" },
  { id: "design", label: "Design", phase: "Design", stageColor: "var(--stage-design)" },
  { id: "development", label: "Development", phase: "Development", stageColor: "var(--stage-development)" },
  { id: "testing", label: "Testing", phase: "Testing", stageColor: "var(--stage-testing)" },
  { id: "gtm", label: "GTM", phase: "GTM", stageColor: "var(--stage-gtm)" },
  { id: "launched", label: "Launched", phase: "Post-Launch", stageColor: "var(--stage-launched)" },
];

// ─── PhaseCarousel (extracted outside render) ───
function PhaseCarousel({ projects: phaseProjects, allProjects, isMobile }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const arrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    zIndex: 2,
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={emblaRef} style={{ overflow: "hidden", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", gap: "var(--sp-md)", padding: "var(--sp-sm) var(--sp-xs)" }}>
          {phaseProjects.map((project) => {
            const globalIndex = allProjects.indexOf(project);
            return (
              <ProjectCard key={project.id} project={project} index={globalIndex} />
            );
          })}
        </div>
      </div>

      {!isMobile && phaseProjects.length > 1 && (
        <>
          {canScrollPrev && (
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous projects"
              style={{ ...arrowStyle, left: "-12px" }}
            >
              <ChevronLeft style={{ width: 18, height: 18 }} />
            </button>
          )}
          {canScrollNext && (
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next projects"
              style={{ ...arrowStyle, right: "-12px" }}
            >
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── HomePage ───
export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");

  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const ideationRef = useRef(null);
  const designRef = useRef(null);
  const developmentRef = useRef(null);
  const testingRef = useRef(null);
  const gtmRef = useRef(null);
  const launchedRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const sectionRefs = {
    hero: heroRef, manifesto: manifestoRef, ideation: ideationRef,
    design: designRef, development: developmentRef, testing: testingRef,
    gtm: gtmRef, launched: launchedRef,
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const entries = SECTIONS.map(s => ({ id: s.id, ref: sectionRefs[s.id] }));

      for (let i = entries.length - 1; i >= 0; i--) {
        if (entries[i].ref.current && entries[i].ref.current.offsetTop <= scrollTop + 200) {
          setActiveSection(entries[i].id);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' });
    }
  };

  const projectsByPhase = (phase) => projects.filter(p => p.phase === phase);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! We'll keep you posted.");
    setEmail("");
  };

  const featured = projects.find(p => p.is_todays_launch) || projects[0];

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg)',
      overflow: isMobile ? 'auto' : 'hidden',
    }}>

      {/* ─── LEFT NAV (desktop) ─── */}
      {!isMobile && (
        <nav
          aria-label="Pipeline stages"
          style={{
            width: '160px',
            minWidth: '160px',
            padding: 'var(--sp-md)',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-sm)',
          }}
        >
          <div style={{
            backgroundColor: 'var(--bg-elevated)',
            padding: 'var(--sp-md)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--sp-sm)',
            border: '1px solid var(--border)',
          }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '16px',
                letterSpacing: '-0.02em',
              }}
              role="banner"
              aria-label="10K Ideas"
            >
              10K IDEAS
            </div>
          </div>

          {SECTIONS.map((section, idx) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(sectionRefs[section.id])}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 'var(--sp-sm) var(--sp-md)',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  background: section.stageColor,
                  color: 'white',
                  height: isActive ? '80px' : '48px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'opacity var(--duration-short) var(--ease-out), transform var(--duration-short) var(--ease-out), height var(--duration-medium) var(--ease-out)',
                  opacity: isActive ? 1 : 0.8,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', opacity: 0.7 }}>
                  {String(idx).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ─── CONTENT ─── */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          height: isMobile ? 'auto' : '100%',
          overflowY: isMobile ? 'visible' : 'auto',
          padding: isMobile ? 'var(--sp-md)' : 'var(--sp-sm)',
        }}
      >
        {/* HERO */}
        <section ref={heroRef} style={{ marginBottom: 'var(--sp-md)' }}>
          <div style={{
            backgroundColor: 'var(--bg)',
            borderRadius: 'var(--radius-xl)',
            padding: isMobile ? 'var(--sp-lg)' : '0',
            minHeight: isMobile ? 'auto' : '450px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : '50%',
              height: isMobile ? '250px' : '450px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src="/dragon-hero.png"
                alt="Dragon and Mouse -- 10K IDEAS mascot"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: isMobile ? 'center' : 'flex-end',
              padding: isMobile ? 'var(--sp-lg) 0' : 'var(--sp-2xl)',
              textAlign: isMobile ? 'center' : 'right',
            }}>
              <div style={{ overflow: 'hidden' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 'clamp(80px, 25vw, 140px)' : 'clamp(120px, 18vw, 220px)',
                  fontWeight: 400,
                  lineHeight: 0.85,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                }}>
                  <span className="animate-char char-1">1</span>
                  <span className="animate-char char-2">0</span>
                  <span className="animate-char char-3">K</span>
                </h1>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--text-secondary)',
                marginTop: 'var(--sp-md)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}>
                An Open-Source Venture Studio
              </p>
            </div>
          </div>

          {/* Today's Launch Banner */}
          {projects.find(p => p.is_todays_launch) && (
            <button
              onClick={() => scrollToSection(launchedRef)}
              aria-label={`View today's launch: ${projects.find(p => p.is_todays_launch)?.title}`}
              style={{
                width: '100%',
                marginTop: 'var(--sp-md)',
                backgroundColor: 'var(--text-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--sp-md) var(--sp-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: 'white',
                border: 'none',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
                <div style={{
                  padding: 'var(--sp-xs) var(--sp-md)',
                  backgroundColor: 'var(--accent)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-xs)',
                  color: 'var(--accent-text)',
                }}>
                  <span style={{
                    width: '6px', height: '6px',
                    backgroundColor: 'var(--accent-text)',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite',
                  }} />
                  LIVE NOW
                </div>
                <span style={{ fontSize: '18px', fontWeight: 500 }}>
                  {projects.find(p => p.is_todays_launch)?.title}
                </span>
              </div>
              <ArrowRight style={{ width: 20, height: 20 }} />
            </button>
          )}
        </section>

        {/* MANIFESTO */}
        <section ref={manifestoRef} style={{ marginBottom: 'var(--sp-md)' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 'var(--sp-md)',
            minHeight: isMobile ? 'auto' : '350px',
          }}>
            {/* Featured Project */}
            <div style={{
              flex: 1,
              background: 'var(--stage-hero)',
              borderRadius: 'var(--radius-xl)',
              padding: isMobile ? 'var(--sp-lg)' : 'var(--sp-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--sp-xs)',
                padding: 'var(--sp-xs) var(--sp-md)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-lg)',
                width: 'fit-content',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                  boxShadow: '0 0 8px var(--success)',
                }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Featured
                </span>
              </div>

              {featured ? (
                <div style={{ marginTop: 'auto' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    margin: '0 0 var(--sp-sm) 0',
                    letterSpacing: '-0.02em',
                  }}>
                    {featured.title}
                  </h3>
                  {featured.description && (
                    <p style={{
                      fontSize: '14px', lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.7)',
                      margin: '0 0 var(--sp-md) 0',
                      maxWidth: '360px',
                    }}>
                      {featured.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 'var(--sp-sm)', flexWrap: 'wrap' }}>
                    {featured.mrr && featured.mrr !== '€0' && (
                      <span style={{
                        padding: 'var(--sp-xs) var(--sp-md)',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '13px', fontWeight: 600,
                      }}>
                        {featured.mrr} MRR
                      </span>
                    )}
                    {featured.phase && (
                      <span style={{
                        padding: 'var(--sp-xs) var(--sp-md)',
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '13px', fontWeight: 600,
                      }}>
                        {featured.phase}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  <p style={{ fontSize: '16px' }}>No projects yet</p>
                </div>
              )}
            </div>

            {/* Manifesto */}
            <div style={{
              flex: 1,
              background: 'var(--stage-manifesto)',
              borderRadius: 'var(--radius-xl)',
              padding: isMobile ? 'var(--sp-lg)' : 'var(--sp-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: 300, opacity: 0.6 }}>00</span>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? 'clamp(36px, 8vw, 56px)' : 'clamp(48px, 5vw, 64px)',
                  fontWeight: 400,
                  lineHeight: 0.95,
                  margin: '0 0 var(--sp-lg) 0',
                }}>
                  Manifesto
                </h2>
                <div style={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.95, maxWidth: '500px' }}>
                  <p style={{ marginBottom: 'var(--sp-md)', fontWeight: 500, fontSize: isMobile ? '18px' : '20px' }}>
                    We live in a world now where you can just do stuff. So we are.
                  </p>
                  <p style={{ marginBottom: 'var(--sp-md)' }}>
                    10K is an open-source venture studio launching one new project every day. We build as a forcing function for creativity.
                  </p>
                  <p style={{ marginBottom: 0, fontWeight: 600 }}>
                    Join a team, submit an idea, or just watch us build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHASE SECTIONS */}
        {SECTIONS.slice(2).map((section, idx) => {
          const ref = sectionRefs[section.id];
          const phaseProjects = projectsByPhase(section.phase);

          return (
            <section key={section.id} ref={ref} style={{ marginBottom: 'var(--sp-md)' }}>
              <div style={{
                background: section.stageColor,
                borderRadius: 'var(--radius-xl)',
                padding: isMobile ? 'var(--sp-xl)' : 'var(--sp-2xl)',
                minHeight: isMobile ? 'auto' : '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white',
              }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '28px', fontWeight: 300 }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: isMobile ? 'clamp(40px, 10vw, 72px)' : 'clamp(56px, 8vw, 88px)',
                    fontWeight: 400,
                    lineHeight: 0.9,
                    margin: 0,
                  }}>
                    {section.label}
                  </h2>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: 'var(--sp-xs) var(--sp-md)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    {phaseProjects.length} project{phaseProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp-md)' }}>
                {phaseProjects.length > 0 ? (
                  <PhaseCarousel
                    projects={phaseProjects}
                    allProjects={projects}
                    isMobile={isMobile}
                  />
                ) : (
                  <div style={{
                    padding: 'var(--sp-2xl)',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    border: '2px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)' }}>No projects in {section.label} yet</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* FOOTER */}
        <footer style={{ marginTop: 'var(--sp-2xl)', marginBottom: 'var(--sp-lg)' }}>
          {/* Subscribe Bar */}
          <div style={{
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--sp-md) var(--sp-xl)',
            marginBottom: 'var(--sp-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              color: 'var(--accent-text)',
            }}>
              PROJECT #{projects.length + 1} IS CURRENTLY BEING COOKED. SUBSCRIBE BELOW.
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubscribe} style={{
            display: 'flex',
            gap: 'var(--sp-md)',
            marginBottom: 'var(--sp-xl)',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <label htmlFor="subscribe-email" className="sr-only">Email address</label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="YOUR@EMAIL.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: 'var(--sp-md) var(--sp-lg)',
                borderRadius: 'var(--radius-full)',
                border: '2px solid var(--text-primary)',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.03em',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              style={{
                padding: 'var(--sp-md) var(--sp-xl)',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.03em',
                color: 'var(--accent-text)',
                transition: 'background-color var(--duration-short) var(--ease-out)',
              }}
            >
              SUBSCRIBE
            </button>
          </form>

          {/* Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--sp-lg)',
            paddingTop: 'var(--sp-lg)',
            borderTop: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                border: '2px solid var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>10,000 Ideas.</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>An Open-Source Venture Studio.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-sm)', fontSize: '14px' }}>
              {[
                { href: 'mailto:hello@10kideas.co', label: 'Contact Us' },
                { href: 'https://twitter.com', label: 'Twitter', external: true },
                { href: 'https://github.com', label: 'GitHub', external: true },
              ].map(({ href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    padding: 'var(--sp-sm) var(--sp-md)',
                    borderRadius: 'var(--radius-md)',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'background-color var(--duration-micro) ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {label}
                </a>
              ))}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
