"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Star, Plus, X, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const PHASES = [
    { id: "Ideation", label: "Ideation", color: "#FFCC00", textColor: "black" },
    { id: "Design", label: "Design", color: "#FF0066", textColor: "white" },
    { id: "Development", label: "Development", color: "#3333FF", textColor: "white" },
    { id: "Testing", label: "Testing", color: "#00CC66", textColor: "white" },
    { id: "GTM", label: "GTM", color: "#6600CC", textColor: "white" },
    { id: "Post-Launch", label: "Launched", color: "#000000", textColor: "white" },
];

const getPhaseStyle = (phaseId) => {
    const phase = PHASES.find(p => p.id === phaseId);
    return phase ? { backgroundColor: phase.color, color: phase.textColor } : { backgroundColor: '#666', color: 'white' };
};

export default function AdminPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        url: "",
        phase: "Ideation",
        tags: "",
        needs: ""
    });

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
            for (const p of projects) {
                if (p.is_todays_launch) {
                    await fetch(`/api/projects/${p.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ is_todays_launch: false, phase: p.phase }),
                    });
                }
            }

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

    const deleteProject = async (projectId) => {
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Project deleted");
            setDeleteConfirm(null);
            fetchProjects();
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newProject.title,
                    description: newProject.description,
                    url: newProject.url || null,
                    phase: newProject.phase,
                    tags: newProject.tags.split(",").map(t => t.trim()).filter(Boolean),
                    needs: newProject.needs.split(",").map(n => n.trim()).filter(Boolean)
                }),
            });

            if (!res.ok) throw new Error("Failed to create");

            toast.success("Project added!");
            setNewProject({ title: "", description: "", url: "", phase: "Ideation", tags: "", needs: "" });
            setShowAddForm(false);
            fetchProjects();
        } catch {
            toast.error("Failed to add project");
        } finally {
            setIsSubmitting(false);
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
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => setShowAddForm(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                backgroundColor: '#FF4400',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}
                        >
                            <Plus style={{ width: '16px', height: '16px' }} />
                            Add Project
                        </button>
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
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            width: '100%',
                            maxWidth: '400px',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Delete Project?</h2>
                            <p style={{ color: '#666', marginBottom: '24px' }}>
                                Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#F5F2EB',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteProject(deleteConfirm.id)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#FF0000',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Project Modal */}
                {showAddForm && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '32px',
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '500', margin: 0 }}>Add New Project</h2>
                                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X style={{ width: '24px', height: '24px' }} />
                                </button>
                            </div>

                            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Title *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Project name"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' }}
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Project URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' }}
                                        value={newProject.url}
                                        onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="What does this project do?"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px', resize: 'none' }}
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Phase
                                    </label>
                                    <select
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' }}
                                        value={newProject.phase}
                                        onChange={(e) => setNewProject({ ...newProject, phase: e.target.value })}
                                    >
                                        {PHASES.map(phase => (
                                            <option key={phase.id} value={phase.id}>{phase.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SaaS, AI, Mobile"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' }}
                                        value={newProject.tags}
                                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Needs (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Developer, Designer, Marketing"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' }}
                                        value={newProject.needs}
                                        onChange={(e) => setNewProject({ ...newProject, needs: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ width: '100%', padding: '14px', backgroundColor: '#FF4400', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: isSubmitting ? 0.5 : 1 }}
                                >
                                    {isSubmitting ? "Adding..." : "Add Project"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

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
                        <div style={{ padding: '48px', textAlign: 'center', color: '#666' }}>No projects yet. Click "Add Project" to create one.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Project</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Phase</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Today&apos;s Launch</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Actions</th>
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
                                            {project.url && (
                                                <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#3333FF', marginTop: '4px', display: 'inline-block' }}>
                                                    {new URL(project.url).hostname}
                                                </a>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <select
                                                value={project.phase}
                                                onChange={(e) => updatePhase(project.id, e.target.value)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    border: 'none',
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    ...getPhaseStyle(project.phase)
                                                }}
                                            >
                                                {PHASES.map((phase) => (
                                                    <option key={phase.id} value={phase.id} style={{ backgroundColor: 'white', color: 'black' }}>{phase.label}</option>
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
                                                {project.is_todays_launch ? "Live" : "Set"}
                                            </button>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => setDeleteConfirm(project)}
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: 'transparent',
                                                    color: '#FF0000',
                                                    border: '1px solid #FF0000',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                <Trash2 style={{ width: '14px', height: '14px' }} />
                                                Delete
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
