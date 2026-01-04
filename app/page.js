"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown, Users, Tag } from "lucide-react";
import { toast } from "react-hot-toast";


export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [expandedProject, setExpandedProject] = useState(null);
  const [joinForm, setJoinForm] = useState({ name: "", email: "", role: "Developer", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ogImages, setOgImages] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Refs for scroll spy
  const heroRef = useRef(null);
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
        // Fetch OG images for projects with URLs
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

  const handleJoinSubmit = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, ...joinForm }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Request sent! The team will reach out.");
      setJoinForm({ name: "", email: "", role: "Developer", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: "hero", label: "10K Ideas", ref: heroRef, color: "#FF4400" },
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
        {/* HERO SECTION */}
        <div ref={heroRef} style={{ marginBottom: '16px' }}>
          <div style={{
            backgroundColor: '#FF4400',
            borderRadius: '32px',
            padding: '48px',
            minHeight: '450px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'white'
          }}>
            <span style={{ fontSize: '32px', fontWeight: '300' }}>00</span>
            <div>
              <h1 style={{
                fontSize: 'clamp(50px, 10vw, 120px)',
                fontWeight: '300',
                lineHeight: '0.9',
                margin: 0
              }}>
                10,000<br />Ideas
              </h1>
              <p style={{ fontSize: '18px', opacity: 0.8, marginTop: '24px', maxWidth: '500px' }}>
                An open-source venture studio launching one new project every day.
              </p>

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
                    marginTop: '32px',
                    backgroundColor: '#000000',
                    borderRadius: '20px',
                    padding: '20px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '6px 12px',
                      backgroundColor: '#FF4400',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
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
        </div>

        {/* PHASE SECTIONS */}
        {sections.slice(1).map((section, idx) => {
          const phaseProjects = projectsByPhase(section.phase);
          const isLightBg = section.id === 'ideation';

          return (
            <div key={section.id} ref={section.ref} style={{ marginBottom: '16px' }}>
              {/* Section Header - Fully Rounded Pill */}
              <div style={{
                backgroundColor: section.color,
                borderRadius: '32px',
                padding: '48px',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: isLightBg ? 'black' : 'white'
              }}>
                <span style={{ fontSize: '32px', fontWeight: '300' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 style={{
                  fontSize: 'clamp(40px, 8vw, 80px)',
                  fontWeight: '300',
                  lineHeight: '0.9',
                  margin: 0
                }}>
                  {section.label}
                </h2>
              </div>

              {/* Projects Area - Separate from header */}
              <div style={{
                marginTop: '12px',
                padding: '0'
              }}>
                {phaseProjects.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                              padding: '28px 36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              minHeight: '80px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
                              <h3 style={{
                                fontSize: '24px',
                                fontWeight: '400',
                                margin: 0,
                                whiteSpace: 'nowrap'
                              }}>
                                {project.title}
                              </h3>
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

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div style={{
                              backgroundColor: '#000000',
                              color: 'white',
                              borderRadius: '0 0 24px 24px',
                              padding: '32px 36px',
                              display: 'flex',
                              gap: '32px'
                            }}>
                              {/* OG Image */}
                              {ogImages[project.id] && (
                                <div style={{
                                  width: '200px',
                                  minWidth: '200px',
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
                              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div>
                                  <h4 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '8px', fontWeight: '400' }}>About</h4>
                                  <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                                    {project.description}
                                  </p>

                                  {project.needs?.length > 0 && (
                                    <>
                                      <h4 style={{ fontSize: '14px', opacity: 0.5, marginBottom: '8px', fontWeight: '400' }}>What we need</h4>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                                        {project.needs.map((need, i) => (
                                          <span key={i} style={{
                                            padding: '6px 12px',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            fontSize: '13px'
                                          }}>
                                            {need}
                                          </span>
                                        ))}
                                      </div>
                                    </>
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

                                {/* Right: Join Form */}
                                <div style={{
                                  backgroundColor: 'rgba(255,255,255,0.05)',
                                  borderRadius: '16px',
                                  padding: '24px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Users style={{ width: '18px', height: '18px' }} />
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Join the Team</h4>
                                  </div>

                                  <form onSubmit={(e) => handleJoinSubmit(e, project.id)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input
                                      required
                                      placeholder="Your name"
                                      style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '14px'
                                      }}
                                      value={joinForm.name}
                                      onChange={e => setJoinForm({ ...joinForm, name: e.target.value })}
                                    />
                                    <input
                                      required
                                      type="email"
                                      placeholder="Email"
                                      style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '14px'
                                      }}
                                      value={joinForm.email}
                                      onChange={e => setJoinForm({ ...joinForm, email: e.target.value })}
                                    />
                                    <select
                                      style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '14px'
                                      }}
                                      value={joinForm.role}
                                      onChange={e => setJoinForm({ ...joinForm, role: e.target.value })}
                                    >
                                      <option value="Developer">Developer</option>
                                      <option value="Designer">Designer</option>
                                      <option value="Marketer">Marketer</option>
                                      <option value="Product Manager">Product Manager</option>
                                      <option value="Other">Other</option>
                                    </select>
                                    <textarea
                                      rows={2}
                                      placeholder="Why do you want to join?"
                                      style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: 'white',
                                        fontSize: '14px',
                                        resize: 'none'
                                      }}
                                      value={joinForm.message}
                                      onChange={e => setJoinForm({ ...joinForm, message: e.target.value })}
                                    />
                                    <button
                                      type="submit"
                                      disabled={isSubmitting}
                                      style={{
                                        padding: '14px',
                                        backgroundColor: '#FF4400',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        border: 'none',
                                        cursor: 'pointer',
                                        opacity: isSubmitting ? 0.5 : 1
                                      }}
                                    >
                                      {isSubmitting ? "Sending..." : "Send Request"}
                                    </button>
                                  </form>
                                </div>
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

        <div style={{ height: '100px' }} />
      </div>
    </main>
  );
}
