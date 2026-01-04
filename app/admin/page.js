"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Star, Plus, X, Trash2, Loader2 } from "lucide-react";
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
    const [editProject, setEditProject] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetchingMeta, setIsFetchingMeta] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
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

    // Auto-fetch metadata when URL is pasted
    const handleUrlChange = async (url) => {
        setFormData(prev => ({ ...prev, url }));

        if (url && url.startsWith('http')) {
            setIsFetchingMeta(true);
            try {
                const res = await fetch(`/api/og-metadata?url=${encodeURIComponent(url)}`);
                const meta = await res.json();

                if (meta.title || meta.description) {
                    setFormData(prev => ({
                        ...prev,
                        title: meta.title || prev.title,
                        description: meta.description || prev.description
                    }));
                    toast.success("Auto-filled from URL");
                }
            } catch {
                // Silent fail - user can still fill manually
            } finally {
                setIsFetchingMeta(false);
            }
        }
    };

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
            const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Project deleted");
            setDeleteConfirm(null);
            fetchProjects();
        } catch {
            toast.error("Failed to delete project");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isEdit = !!editProject;
        const endpoint = isEdit ? `/api/projects/${editProject.id}` : "/api/projects";
        const method = isEdit ? "PATCH" : "POST";

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    url: formData.url || null,
                    phase: formData.phase,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                    needs: formData.needs.split(",").map(n => n.trim()).filter(Boolean)
                }),
            });

            if (!res.ok) throw new Error("Failed");

            toast.success(isEdit ? "Project updated!" : "Project added!");
            resetForm();
            fetchProjects();
        } catch {
            toast.error(isEdit ? "Failed to update project" : "Failed to add project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", url: "", phase: "Ideation", tags: "", needs: "" });
        setShowAddForm(false);
        setEditProject(null);
    };

    const openEditModal = (project) => {
        setFormData({
            title: project.title || "",
            description: project.description || "",
            url: project.url || "",
            phase: project.phase || "Ideation",
            tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
            needs: Array.isArray(project.needs) ? project.needs.join(", ") : ""
        });
        setEditProject(project);
    };

    const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#F5F2EB', border: 'none', fontSize: '14px' };
    const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F5F2EB', padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '16px', fontSize: '14px' }}>
                            <ArrowLeft style={{ width: '16px', height: '16px' }} />
                            Back to Home
                        </Link>
                        <h1 style={{ fontSize: '32px', fontWeight: '400', margin: 0 }}>Admin Dashboard</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setShowAddForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: '#FF4400', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                            <Plus style={{ width: '16px', height: '16px' }} />
                            Add Project
                        </button>
                        <button onClick={fetchProjects} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>
                            <RefreshCw style={{ width: '16px', height: '16px' }} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Delete Project?</h2>
                            <p style={{ color: '#666', marginBottom: '24px' }}>Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This cannot be undone.</p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: '12px 24px', backgroundColor: '#F5F2EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                                <button onClick={() => deleteProject(deleteConfirm.id)} style={{ padding: '12px 24px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Project Modal */}
                {(showAddForm || editProject) && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '500', margin: 0 }}>{editProject ? "Edit Project" : "Add New Project"}</h2>
                                <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X style={{ width: '24px', height: '24px' }} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Project URL (paste to auto-fill)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            style={inputStyle}
                                            value={formData.url}
                                            onChange={(e) => handleUrlChange(e.target.value)}
                                        />
                                        {isFetchingMeta && (
                                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Title *</label>
                                    <input required type="text" placeholder="Project name" style={inputStyle} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Description *</label>
                                    <textarea required rows={3} placeholder="What does this project do?" style={{ ...inputStyle, resize: 'none' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Phase</label>
                                    <select style={inputStyle} value={formData.phase} onChange={(e) => setFormData({ ...formData, phase: e.target.value })}>
                                        {PHASES.map(phase => (<option key={phase.id} value={phase.id}>{phase.label}</option>))}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Tags (comma-separated)</label>
                                    <input type="text" placeholder="SaaS, AI, Mobile" style={inputStyle} value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                                </div>

                                <div>
                                    <label style={labelStyle}>Needs (comma-separated)</label>
                                    <input type="text" placeholder="Developer, Designer, Marketing" style={inputStyle} value={formData.needs} onChange={(e) => setFormData({ ...formData, needs: e.target.value })} />
                                </div>

                                <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '14px', backgroundColor: '#FF4400', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: isSubmitting ? 0.5 : 1 }}>
                                    {isSubmitting ? "Saving..." : (editProject ? "Save Changes" : "Add Project")}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Projects Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    {isLoading ? (
                        <div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>
                    ) : projects.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#666' }}>No projects yet. Click &quot;Add Project&quot; to create one.</div>
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
                                    <tr key={project.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => openEditModal(project)}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: '500', fontSize: '16px' }}>{project.title}</div>
                                            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{project.description?.slice(0, 60)}...</div>
                                            {project.url && (
                                                <span onClick={(e) => e.stopPropagation()} style={{ fontSize: '12px', color: '#3333FF', marginTop: '4px', display: 'inline-block' }}>
                                                    <a href={project.url} target="_blank" rel="noopener noreferrer">{new URL(project.url).hostname}</a>
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px' }} onClick={(e) => e.stopPropagation()}>
                                            <select value={project.phase} onChange={(e) => updatePhase(project.id, e.target.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', ...getPhaseStyle(project.phase) }}>
                                                {PHASES.map((phase) => (<option key={phase.id} value={phase.id} style={{ backgroundColor: 'white', color: 'black' }}>{phase.label}</option>))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => setTodaysLaunch(project.id)} style={{ padding: '8px 16px', backgroundColor: project.is_todays_launch ? '#FF4400' : 'transparent', color: project.is_todays_launch ? 'white' : '#666', border: project.is_todays_launch ? 'none' : '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                                <Star style={{ width: '14px', height: '14px', fill: project.is_todays_launch ? 'white' : 'none' }} />
                                                {project.is_todays_launch ? "Live" : "Set"}
                                            </button>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => setDeleteConfirm(project)} style={{ padding: '8px 12px', backgroundColor: 'transparent', color: '#FF0000', border: '1px solid #FF0000', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
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

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
