"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Lightbulb, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  // const [backlogIdeas, setBacklogIdeas] = useState([]); // Unused for now
  // const [isLoading, setIsLoading] = useState(true); // Unused for now

  const launchRef = useRef(null);
  const ideationRef = useRef(null);
  const designRef = useRef(null);
  const developmentRef = useRef(null);
  const gtmRef = useRef(null);
  const launchedRef = useRef(null);

  const [activeSection, setActiveSection] = useState('launch');

  useEffect(() => {
    // Fetch projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array
        setProjects(Array.isArray(data) ? data : []);
        // setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setProjects([]);
        // setIsLoading(false);
      });

    // Fetch backlog (commented out as unused)
    /*
    fetch('/api/backlog')
      .then(res => res.json())
      .then(data => setBacklogIdeas(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching backlog:', err));
    */
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      const sections = [
        { ref: launchedRef, id: 'launched' },
        { ref: gtmRef, id: 'gtm' },
        { ref: developmentRef, id: 'development' },
        { ref: designRef, id: 'design' },
        { ref: ideationRef, id: 'ideation' },
        { ref: launchRef, id: 'launch' }
      ];

      for (const section of sections) {
        if (section.ref.current && scrollPosition >= section.ref.current.offsetTop) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dailyProject = projects.find(p => p.phase === 'Launch') || projects[0];
  const projectsByPhase = (phase) => projects.filter(p => p.phase === phase);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <main className="relative">
        <div className="lg:pl-16 p-4 md:p-12 max-w-[1800px] mx-auto space-y-24 md:space-y-32 pb-32">

          {/* Site Descriptor Header */}
          <div className="pt-24 md:pt-12 relative z-20" ref={launchRef}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">10,000 IDEAS</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              An open-source venture studio launching one new project every day.
              Join a team, submit an idea, or just watch us build.
            </p>

            {/* Dual CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              <Link
                href="/submit-problem"
                className="group p-4 md:p-5 rounded-xl border-2 border-black/10 hover:border-black transition-all bg-white hover:bg-black hover:text-white text-left block cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                    <div>
                      <h3 className="text-lg font-bold">Submit a Problem</h3>
                      <p className="text-xs opacity-60 group-hover:opacity-80 mt-0.5">Share a problem that needs solving</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link
                href="/submit"
                className="group p-4 md:p-5 rounded-xl border-2 border-black/10 hover:border-black transition-all bg-white hover:bg-black hover:text-white text-left block cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                    <div>
                      <h3 className="text-lg font-bold">Submit an Idea</h3>
                      <p className="text-xs opacity-60 group-hover:opacity-80 mt-0.5">Pitch a project we should build</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>

          {/* Today&apos;s Launch */}
          {dailyProject && (
            <div>
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <div className="h-px flex-1 bg-black/10" />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Today&apos;s Launch</h2>
                <div className="h-px flex-1 bg-black/10" />
              </div>
              <div className="w-full relative">
                <div className="p-8 md:p-12 rounded-3xl bg-white border-2 border-black/10">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">{dailyProject.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{dailyProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {dailyProject.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase Sections */}
          <PhaseSection
            ref={ideationRef}
            title="Ideation Phase"
            description="Where raw concepts become actionable plans. Vote on the backlog or submit your own."
            color="yellow-500"
            projects={projectsByPhase('Ideation')}
          />

          <PhaseSection
            ref={designRef}
            title="In Design"
            description="Crafting the user experience and visual identity. Pixels are being pushed right now."
            color="pink-500"
            projects={projectsByPhase('Design')}
          />

          <PhaseSection
            ref={developmentRef}
            title="Under Development"
            description="Code is being written. Systems are coming online. The machine is waking up."
            color="blue-500"
            projects={projectsByPhase('Development')}
          />

          <PhaseSection
            ref={gtmRef}
            title="Go To Market"
            description="Launch prep, marketing campaigns, and growth hacking. It's showtime."
            color="green-500"
            projects={projectsByPhase('Testing')}
          />

          <PhaseSection
            ref={launchedRef}
            title="Launched"
            description="Live in production. Users in the wild. The journey continues."
            color="purple-500"
            projects={projectsByPhase('Post-Launch')}
          />

        </div>
      </main>
    </div>
  );
}

const PhaseSection = ({ title, description, color, projects }, ref) => {
  // Map simple color names to specific Tailwind classes or hex values
  const colorMap = {
    "yellow-500": "bg-yellow-500",
    "pink-500": "bg-pink-500",
    "blue-500": "bg-blue-500",
    "green-500": "bg-green-500",
    "purple-500": "bg-purple-500"
  };

  const bgClass = colorMap[color] || "bg-gray-800";

  return (
    <div ref={ref} className="scroll-mt-24 mb-16 md:mb-24">
      <div className={`p-8 md:p-12 rounded-[2rem] text-white ${bgClass} min-h-[240px] flex flex-col justify-center relative overflow-hidden mb-8 shadow-xl`}>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 relative z-10">{title}</h1>
        <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl relative z-10 leading-snug">{description}</p>

        {/* Abstract shapes for visual interest */}
        <div className="absolute -right-20 -bottom-40 w-80 h-80 rounded-full bg-white/20 blur-3xl pointer-events-none mix-blend-overlay" />
        <div className="absolute -left-20 -top-40 w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none" />
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group p-6 rounded-2xl bg-white border-2 border-black/5 hover:border-black/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600">
                  {project.phase}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transform group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-base line-clamp-3 mb-6 flex-grow">{project.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-black/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 min-h-[200px]">
          <div className="p-3 bg-white rounded-full mb-4 shadow-sm">
            <Lightbulb className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No projects in this phase yet</h3>
          <p className="text-gray-500 max-w-sm">
            We move fast. Check back tomorrow or <Link href="/submit" className="text-primary hover:underline font-bold">submit an idea</Link> to jumpstart this phase.
          </p>
        </div>
      )}
    </div>
  );
};
