"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [expandedProject, setExpandedProject] = useState(null);
  const [ogImages, setOgImages] = useState({});
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
        projectList.forEach(project => {
          if (project.url) {
            fetch(`/api/og-metadata?url=${encodeURIComponent(project.url)}`)
              .then(res => res.json())
              .then(meta => {
                if (meta.image) {
                  setOgImages(prev => ({ ...prev, [project.id]: meta.image }));
                }
              })
              .catch(() => { });
          }
        });
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
    { id: "hero", label: "10K Ideas", ref: heroRef, color: "#000000" },
    { id: "manifesto", label: "Manifesto", ref: manifestoRef, color: "#FF4400" },
    { id: "ideation", label: "Ideation", ref: ideationRef, color: "#FFCC00", phase: "Ideation" },
    { id: "design", label: "Design", ref: designRef, color: "#FF0066", phase: "Design" },
    { id: "development", label: "Development", ref: developmentRef, color: "#3333FF", phase: "Development" },
    { id: "testing", label: "Testing", ref: testingRef, color: "#00CC66", phase: "Testing" },
    { id: "gtm", label: "GTM", ref: gtmRef, color: "#6600CC", phase: "GTM" },
    { id: "launched", label: "Launched", ref: launchedRef, color: "#000000", phase: "Post-Launch" },
  ];

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
            <h1 style={{ fontWeight: 'bold', fontSize: '18px', letterSpacing: '-0.02em', margin: 0 }}>10K IDEAS</h1>
          </div>

          {sections.map((section, idx) => {
            const isActive = activeSection === section.id;
            const isLightColor = section.id === 'ideation';
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
                  backgroundColor: section.color,
                  color: isLightColor ? 'black' : 'white',
                  height: isActive ? '100px' : '60px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
        {/* HERO SECTION - Black & White */}
        <div ref={heroRef} style={{ marginBottom: '16px' }}>
          <div style={{
            backgroundColor: '#F5F2EB',
            borderRadius: '32px',
            padding: isMobile ? '32px' : '48px',
            minHeight: isMobile ? 'auto' : '450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.5 }}>10,000<br />Ideas</span>
              <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.5, textAlign: 'right' }}>An Open-Source<br />Venture Studio</span>
            </div>
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: isMobile ? 'clamp(60px, 20vw, 120px)' : 'clamp(80px, 15vw, 200px)',
                fontWeight: '400',
                lineHeight: '0.85',
                margin: 0,
                letterSpacing: '-0.03em',
                color: '#000'
              }}>
                10K
              </h1>
            </div>

            {/* Today's Launch Banner */}
            {projects.find(p => p.is_todays_launch) && (
              <div
                onClick={() => {
                  const todaysProject = projects.find(p => p.is_todays_launch);
                  if (todaysProject) {
                    scrollToSection(launchedRef);
                    setTimeout(() => setExpandedProject(todaysProject.id), 300);
                  }
                }}
                style={{
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
        </div>

        {/* MANIFESTO SECTION - Orange */}
        <div ref={manifestoRef} style={{ marginBottom: '16px' }}>
          <div style={{
            backgroundColor: '#FF4400',
            borderRadius: '32px',
            padding: isMobile ? '32px' : '48px',
            color: 'white'
          }}>
            <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '400', lineHeight: '1.2', marginBottom: '32px' }}>
              A project a day. That&apos;s the bet.
            </h2>
            <div style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.7', opacity: 0.9, maxWidth: '800px' }}>
              <p style={{ marginBottom: '24px' }}>
                We used to think building things took months. Funding rounds, roadmaps, sprints. Now you can ship something real before lunch.
              </p>
              <p style={{ marginBottom: '24px' }}>
                So that&apos;s what we&apos;re doing. One idea, one day, out the door. Most will fail. Some won&apos;t. We&apos;ll find out fast.
              </p>
              <p style={{ marginBottom: '24px' }}>
                The old way was to plan forever then build. We build to find out what we&apos;re even making. Cardboard prototypes. Ugly first versions. Real users telling us where it hurts.
              </p>
              <p style={{ marginBottom: '24px' }}>
                We&apos;re not precious about it. Kill the ones that don&apos;t work. Double down on the ones that do.
              </p>
              <p style={{ marginBottom: '24px' }}>
                Everything&apos;s open. The wins, the flops, the numbers. You can build with us or just watch. Either way, no secrets.
              </p>
              <p style={{ marginBottom: 0, fontWeight: '600' }}>
                We live in a world now where you can just do stuff. So we are.
              </p>
            </div>
          </div>
        </div>

        {/* PHASE SECTIONS */}
        {sections.slice(2).map((section, idx) => {
          const phaseProjects = projectsByPhase(section.phase);
          const isLightBg = section.id === 'ideation';

          return (
            <div key={section.id} ref={section.ref} style={{ marginBottom: '16px' }}>
              {/* Section Header */}
              <div style={{
                backgroundColor: section.color,
                borderRadius: '32px',
                padding: isMobile ? '32px' : '48px',
                minHeight: isMobile ? 'auto' : '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: isLightBg ? 'black' : 'white'
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
                    backgroundColor: isLightBg ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {phaseProjects.length} project{phaseProjects.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Projects */}
              <div style={{ marginTop: '12px' }}>
                {phaseProjects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {phaseProjects.map((project) => {
                      const isExpanded = expandedProject === project.id;
                      return (
                        <div key={project.id}>
                          {/* Project Card Header */}
                          <div
                            onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                            style={{
                              backgroundColor: '#000000',
                              color: 'white',
                              borderRadius: isExpanded ? '24px 24px 0 0' : '24px',
                              padding: isMobile ? '20px' : '28px 36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              minHeight: '80px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '40px', flex: 1, minWidth: 0 }}>
                              <h3 style={{
                                fontSize: isMobile ? '18px' : '24px',
                                fontWeight: '400',
                                margin: 0,
                                whiteSpace: 'nowrap'
                              }}>
                                {project.title}
                              </h3>
                              {!isMobile && (
                                <p style={{
                                  fontSize: '13px',
                                  opacity: 0.5,
                                  margin: 0,
                                  maxWidth: '280px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {project.description}
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '24px',
                                padding: '6px 16px',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontFamily: 'monospace'
                              }}>
                                {project.phase}
                              </div>
                              <ChevronDown style={{
                                width: '20px',
                                height: '20px',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                              }} />
                            </div>
                          </div>

                          {/* Expanded Content - Simplified (no join form) */}
                          {isExpanded && (
                            <div style={{
                              backgroundColor: '#000000',
                              color: 'white',
                              borderRadius: '0 0 24px 24px',
                              padding: isMobile ? '24px' : '32px 36px',
                              display: 'flex',
                              gap: '32px',
                              flexDirection: isMobile ? 'column' : 'row'
                            }}>
                              {/* OG Image */}
                              {ogImages[project.id] && (
                                <div style={{
                                  width: isMobile ? '100%' : '200px',
                                  minWidth: isMobile ? 'auto' : '200px',
                                  height: '150px',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  flexShrink: 0
                                }}>
                                  <img
                                    src={ogImages[project.id]}
                                    alt={project.title}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              )}

                              {/* Content */}
                              <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '8px', fontWeight: '400' }}>About</h4>
                                <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                                  {project.description}
                                </p>

                                {project.url && (
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '12px 24px',
                                      backgroundColor: '#00FF00',
                                      color: 'black',
                                      borderRadius: '12px',
                                      textDecoration: 'none',
                                      fontWeight: '600',
                                      fontSize: '14px',
                                      marginBottom: '24px'
                                    }}
                                  >
                                    Visit Project <ArrowRight style={{ width: '16px', height: '16px' }} />
                                  </a>
                                )}

                                {project.tags?.length > 0 && (
                                  <>
                                    <h4 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '8px', fontWeight: '400' }}>Tags</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                      {project.tags.map((tag, i) => (
                                        <div key={i} style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '4px 10px',
                                          backgroundColor: 'rgba(255,255,255,0.05)',
                                          borderRadius: '6px',
                                          fontSize: '12px',
                                          opacity: 0.7
                                        }}>
                                          <Tag style={{ width: '10px', height: '10px' }} />
                                          {tag}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
                fontSize: '20px'
              }}>
                ☺
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>10,000 Ideas.</div>
                <div style={{ fontSize: '13px', opacity: 0.6 }}>An Open-Source Venture Studio.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
              <a href="mailto:hello@10kideas.co" style={{ color: 'black', textDecoration: 'underline' }}>Contact Us</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'underline' }}>Twitter</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'underline' }}>GitHub</a>
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
