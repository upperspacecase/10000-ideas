"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Star } from "lucide-react";
import { toast } from "react-hot-toast";

const PHASES = ["Ideation", "Design", "Development", "Testing", "GTM", "Post-Launch"];

export default function AdminPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching projects:", err);
            toast.error("Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const updatePhase = async (projectId, newPhase) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phase: newPhase }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success(`Moved to ${newPhase}`);
            fetchProjects();
        } catch {
            toast.error("Failed to update phase");
        }
    };

    const setTodaysLaunch = async (projectId) => {
        try {
            // First clear any existing today's launch
            for (const p of projects) {
                if (p.is_todays_launch) {
                    await fetch(`/api/projects/${p.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ is_todays_launch: false, phase: p.phase }),
                    });
                }
            }

            // Set new today's launch
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_todays_launch: true, phase: "Post-Launch" }),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Set as Today's Launch!");
            fetchProjects();
        } catch {
            toast.error("Failed to set today's launch");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F2EB',
            padding: '24px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <Link href="/" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#666',
                            textDecoration: 'none',
                            marginBottom: '16px',
                            fontSize: '14px'
                        }}>
                            <ArrowLeft style={{ width: '16px', height: '16px' }} />
                            Back to Home
                        </Link>
                        <h1 style={{ fontSize: '32px', fontWeight: '400', margin: 0 }}>Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={fetchProjects}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: 'white',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        <RefreshCw style={{ width: '16px', height: '16px' }} />
                        Refresh
                    </button>
                </div>

                {/* Projects Table */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}>
                    {isLoading ? (
                        <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
                    ) : projects.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#666' }}>No projects yet</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Project</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Current Phase</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Move To</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Today&apos;s Launch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: '500', fontSize: '16px' }}>{project.title}</div>
                                            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                                                {project.description?.slice(0, 60)}...
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '6px 12px',
                                                backgroundColor: '#F5F2EB',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}>
                                                {project.phase}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <select
                                                value={project.phase}
                                                onChange={(e) => updatePhase(project.id, e.target.value)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    fontSize: '14px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {PHASES.map((phase) => (
                                                    <option key={phase} value={phase}>{phase}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setTodaysLaunch(project.id)}
                                                style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: project.is_todays_launch ? '#FF4400' : 'transparent',
                                                    color: project.is_todays_launch ? 'white' : '#666',
                                                    border: project.is_todays_launch ? 'none' : '1px solid rgba(0,0,0,0.1)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                <Star style={{ width: '14px', height: '14px', fill: project.is_todays_launch ? 'white' : 'none' }} />
                                                {project.is_todays_launch ? "Active" : "Set"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
