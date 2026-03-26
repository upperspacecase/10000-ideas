"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "@/components/ProjectCard";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("hero");

  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");

  // Refs for scroll spy
  const heroRef = useRef(null);
  const manifestoRef = useRef(null);
  const ideationRef = useRef(null);
  const designRef = useRef(null);
  const developmentRef = useRef(null);
  const testingRef = useRef(null);
  const gtmRef = useRef(null);
  const launchedRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const projectList = Array.isArray(data) ? data : [];
        setProjects(projectList);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setProjects([]);
      });
  }, []);

  // Scroll spy
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const sections = [
        { ref: heroRef, id: "hero" },
        { ref: manifestoRef, id: "manifesto" },
        { ref: ideationRef, id: "ideation" },
        { ref: designRef, id: "design" },
        { ref: developmentRef, id: "development" },
        { ref: testingRef, id: "testing" },
        { ref: gtmRef, id: "gtm" },
        { ref: launchedRef, id: "launched" },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollTop + 200) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const projectsByPhase = (phase) => projects.filter(p => p.phase === phase);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! We'll keep you posted.");
    setEmail("");
  };

  const sections = [
    { id: "hero", label: "10K Ideas", ref: heroRef, color: "#000000", gradient: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
    { id: "manifesto", label: "Manifesto", ref: manifestoRef, color: "#FF4400", gradient: "linear-gradient(160deg, #ff6a00 0%, #ee0979 50%, #ff6a00 100%)" },
    { id: "ideation", label: "Ideation", ref: ideationRef, color: "#FFCC00", phase: "Ideation", gradient: "linear-gradient(160deg, #f7971e 0%, #ffd200 50%, #f7971e 100%)" },
    { id: "design", label: "Design", ref: designRef, color: "#FF0066", phase: "Design", gradient: "linear-gradient(160deg, #fc466b 0%, #3f5efb 50%, #fc466b 100%)" },
    { id: "development", label: "Development", ref: developmentRef, color: "#3333FF", phase: "Development", gradient: "linear-gradient(160deg, #304ffe 0%, #6200ea 50%, #aa00ff 100%)" },
    { id: "testing", label: "Testing", ref: testingRef, color: "#00CC66", phase: "Testing", gradient: "linear-gradient(160deg, #00c853 0%, #009624 50%, #004d00 100%)" },
    { id: "gtm", label: "GTM", ref: gtmRef, color: "#6600CC", phase: "GTM", gradient: "linear-gradient(160deg, #7b1fa2 0%, #4a148c 50%, #12005e 100%)" },
    { id: "launched", label: "Launched", ref: launchedRef, color: "#000000", phase: "Post-Launch", gradient: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
  ];

  // ─── PhaseCarousel: horizontal Embla Carousel of ProjectCards ───
  const PhaseCarousel = ({ projects: phaseProjects, allProjects, isMobile: mobile }) => {
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

    return (
      <div style={{ position: "relative" }}>
        {/* Carousel viewport */}
        <div ref={emblaRef} style={{ overflow: "hidden", borderRadius: "16px" }}>
          <div style={{ display: "flex", gap: "16px", padding: "8px 4px" }}>
            {phaseProjects.map((project) => {
              const globalIndex = allProjects.indexOf(project);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={globalIndex}
                />
              );
            })}
          </div>
        </div>

        {/* Prev / Next arrows (desktop only) */}
        {!mobile && phaseProjects.length > 1 && (
          <>
            {canScrollPrev && (
              <button
                onClick={() => emblaApi?.scrollPrev()}
                style={{
                  position: "absolute",
                  left: "-12px",
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
                }}
              >
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
                style={{
                  position: "absolute",
                  right: "-12px",
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
                }}
              >
                <ChevronRight style={{ width: 18, height: 18 }} />
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      width: '100%',
      backgroundColor: '#F5F2EB',
      overflow: isMobile ? 'auto' : 'hidden'
    }}>
      {/* Left Navigation - Hidden on mobile */}
      {!isMobile && (
        <div style={{
          width: '160px',
          minWidth: '160px',
          padding: '16px',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '8px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '-0.02em', margin: 0 }} role="banner" aria-label="10K Ideas">10K IDEAS</div>
          </div>

          {sections.map((section, idx) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.ref)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: section.gradient,
                  color: 'white',
                  height: isActive ? '100px' : '60px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease',
                  opacity: isActive ? 1 : 0.85,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '10px', fontFamily: 'monospace', opacity: 0.7 }}>
                  {String(idx).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content - Full width on mobile */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          height: isMobile ? 'auto' : '100%',
          overflowY: isMobile ? 'visible' : 'auto',
          padding: isMobile ? '16px' : '8px'
        }}
      >
        {/* HERO SECTION */}
        <div ref={heroRef} style={{ marginBottom: '16px' }}>
          <div style={{
            backgroundColor: '#F5F2EB',
            borderRadius: '32px',
            padding: isMobile ? '24px' : '0',
            minHeight: isMobile ? 'auto' : '450px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            {/* Dragon Image */}
            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : '50%',
              height: isMobile ? '250px' : '450px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/dragon-hero.png"
                alt="Dragon and Mouse"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* 10K Text */}
            <div style={{
              flex: isMobile ? 'none' : '1',
              width: isMobile ? '100%' : '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: isMobile ? 'center' : 'flex-end',
              padding: isMobile ? '24px 0' : '48px',
              textAlign: isMobile ? 'center' : 'right'
            }}>
              <div style={{ overflow: 'hidden' }}>
                <h1 style={{
                  fontSize: isMobile ? 'clamp(80px, 25vw, 140px)' : 'clamp(120px, 18vw, 220px)',
                  fontWeight: '400',
                  lineHeight: '0.85',
                  margin: 0,
                  letterSpacing: '-0.03em',
                  color: '#000'
                }}>
                  <span className="animate-char char-1">1</span>
                  <span className="animate-char char-2">0</span>
                  <span className="animate-char char-3">K</span>
                </h1>
              </div>
              <p style={{
                fontSize: '16px',
                opacity: 0.7,
                marginTop: '16px',
                fontWeight: '500',
                letterSpacing: '0.02em',
              }}>
                An Open-Source Venture Studio
              </p>
            </div>
          </div>

          {/* Today's Launch Banner */}
          {projects.find(p => p.is_todays_launch) && (
            <div
              onClick={() => {
                const todaysProject = projects.find(p => p.is_todays_launch);
                if (todaysProject) {
                  scrollToSection(launchedRef);
                }
              }}
              style={{
                marginTop: '12px',
                backgroundColor: '#000000',
                borderRadius: '20px',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: '#00FF00',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'black'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  LIVE NOW
                </div>
                <span style={{ fontSize: '18px', fontWeight: '500' }}>
                  {projects.find(p => p.is_todays_launch)?.title}
                </span>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </div>
          )}
        </div>

        {/* MANIFESTO SECTION – Split: Featured Project + Manifesto */}
        <div ref={manifestoRef} style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            minHeight: isMobile ? 'auto' : '350px',
          }}>
            {/* Left: Featured Project */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '32px',
              padding: isMobile ? '28px' : '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle label */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                width: 'fit-content',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: '#00ff88',
                  boxShadow: '0 0 8px #00ff88',
                }} />
                <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Featured
                </span>
              </div>

              {/* Featured project content */}
              {(() => {
                const featured = projects.find(p => p.is_todays_launch) || projects[0];
                if (!featured) return (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <p style={{ fontSize: '16px' }}>No projects yet</p>
                  </div>
                );
                return (
                  <div style={{ marginTop: 'auto' }}>
                    <h3 style={{
                      fontSize: isMobile ? '28px' : '36px',
                      fontWeight: '700',
                      lineHeight: '1.1',
                      margin: '0 0 12px 0',
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                    }}>
                      {featured.title}
                    </h3>
                    {featured.description && (
                      <p style={{
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: 'rgba(255,255,255,0.7)',
                        margin: '0 0 16px 0',
                        maxWidth: '360px',
                      }}>
                        {featured.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {featured.mrr && featured.mrr !== '€0' && (
                        <span style={{
                          padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.12)',
                          borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                          backdropFilter: 'blur(8px)',
                        }}>
                          {featured.mrr} MRR
                        </span>
                      )}
                      {featured.phase && (
                        <span style={{
                          padding: '6px 14px', backgroundColor: 'rgba(255,255,255,0.12)',
                          borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                          backdropFilter: 'blur(8px)',
                        }}>
                          {featured.phase}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Right: Manifesto */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(160deg, #ff6a00 0%, #ee0979 50%, #ff6a00 100%)',
              borderRadius: '32px',
              padding: isMobile ? '28px' : '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: 'white',
            }}>
              <span style={{ fontSize: '28px', fontWeight: '300', opacity: 0.6 }}>00</span>
              <div>
                <h2 style={{
                  fontSize: isMobile ? 'clamp(36px, 8vw, 60px)' : 'clamp(48px, 5vw, 72px)',
                  fontWeight: '300',
                  lineHeight: '0.9',
                  margin: 0,
                  marginBottom: '24px'
                }}>
                  Manifesto
                </h2>
                <div style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, maxWidth: '500px' }}>
                  <p style={{ marginBottom: '16px', fontWeight: '500', fontSize: isMobile ? '18px' : '22px' }}>
                    We live in a world now where you can just do stuff. So we are.
                  </p>
                  <p style={{ marginBottom: '16px' }}>
                    10K is an open-source venture studio launching one new project every day. We build as a forcing function for creativity.
                  </p>
                  <p style={{ marginBottom: 0, fontWeight: '600' }}>
                    Join a team, submit an idea, or just watch us build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE SECTIONS */}
        {sections.slice(2).map((section, idx) => {
          const phaseProjects = projectsByPhase(section.phase);

          return (
            <div key={section.id} ref={section.ref} style={{ marginBottom: '16px' }}>
              {/* Section Header */}
              <div style={{
                background: section.gradient,
                borderRadius: '32px',
                padding: isMobile ? '32px' : '48px',
                minHeight: isMobile ? 'auto' : '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white'
              }}>
                <span style={{ fontSize: '32px', fontWeight: '300' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <h2 style={{
                    fontSize: isMobile ? 'clamp(40px, 10vw, 80px)' : 'clamp(60px, 8vw, 100px)',
                    fontWeight: '300',
                    lineHeight: '0.9',
                    margin: 0
                  }}>
                    {section.label}
                  </h2>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backdropFilter: 'blur(8px)',
                  }}>
                    {phaseProjects.length} project{phaseProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Projects – Horizontal Carousel */}
              <div style={{ marginTop: '12px' }}>
                {phaseProjects.length > 0 ? (
                  <PhaseCarousel
                    projects={phaseProjects}
                    allProjects={projects}
                    isMobile={isMobile}
                  />
                ) : (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(0,0,0,0.4)',
                    border: '2px dashed rgba(0,0,0,0.1)',
                    borderRadius: '16px'
                  }}>
                    <p style={{ margin: 0 }}>No projects in {section.label} yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* FOOTER */}
        <div style={{ marginTop: '48px', marginBottom: '24px' }}>
          {/* Subscribe Bar */}
          <div style={{
            backgroundColor: '#00FF00',
            borderRadius: '24px',
            padding: '20px 32px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.05em' }}>
              ↓ PROJECT #{projects.length + 1} IS CURRENTLY BEING COOKED. CURIOUS? SUBSCRIBE BELOW. ↓
            </span>
          </div>

          {/* Email Input */}
          <form onSubmit={handleSubscribe} style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '18px 24px',
                borderRadius: '50px',
                border: '2px solid #000',
                backgroundColor: 'transparent',
                fontSize: '16px',
                fontWeight: '500',
                letterSpacing: '0.05em'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '18px 32px',
                backgroundColor: '#00FF00',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              SUBSCRIBE
            </button>
          </form>

          {/* Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>10,000 Ideas.</div>
                <div style={{ fontSize: '13px', opacity: 0.6 }}>An Open-Source Venture Studio.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
              {[
                { href: 'mailto:hello@10kideas.co', label: 'Contact Us' },
                { href: 'https://twitter.com', label: 'Twitter', external: true },
                { href: 'https://github.com', label: 'GitHub', external: true },
              ].map(({ href, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="footer-link"
                  style={{
                    color: 'black',
                    textDecoration: 'none',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {label}
                </a>
              ))}
            </div>

            <div style={{ fontSize: '14px', opacity: 0.6 }}>
              © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
