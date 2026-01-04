"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Users, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function ProjectDetail() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [joinForm, setJoinForm] = useState({
        name: "",
        email: "",
        role: "Developer",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params?.id) {
            fetch(`/api/projects/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setProject(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching project:", err);
                    setIsLoading(false);
                });
        }
    }, [params?.id]);

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/join-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: project.id,
                    ...joinForm
                }),
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

    const phaseColors = {
        'Ideation': '#FFCC00',
        'Design': '#FF0066',
        'Development': '#3333FF',
        'Testing': '#00CC66',
        'GTM': '#6600CC',
        'Launch': '#FF4400',
        'Post-Launch': '#000000'
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F5F2EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid #FF4400',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    if (!project) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#F5F2EB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Project not found 😕</h1>
                <Link href="/" style={{ color: '#FF4400', textDecoration: 'underline' }}>Back to Home</Link>
            </div>
        );
    }

    const phaseColor = phaseColors[project.phase] || '#000000';
    const isLightPhase = project.phase === 'Ideation';

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F2EB',
            paddingBottom: '100px'
        }}>
            {/* Hero Header */}
            <div style={{
                backgroundColor: phaseColor,
                color: isLightPhase ? 'black' : 'white',
                padding: '48px',
                margin: '16px',
                borderRadius: '32px',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Link href="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: isLightPhase ? 'black' : 'white',
                        textDecoration: 'none',
                        opacity: 0.8,
                        fontSize: '14px'
                    }}>
                        <ArrowLeft style={{ width: '16px', height: '16px' }} />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                        }}
                        style={{
                            padding: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            color: isLightPhase ? 'black' : 'white'
                        }}
                    >
                        <Share2 style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                <div>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '16px'
                    }}>
                        {project.phase}
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(36px, 8vw, 72px)',
                        fontWeight: '400',
                        lineHeight: '1',
                        margin: 0
                    }}>
                        {project.title}
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        opacity: 0.7,
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Calendar style={{ width: '14px', height: '14px' }} />
                        {format(new Date(project.created_at), 'MMMM d, yyyy')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px'
            }}>
                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>About</h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', whiteSpace: 'pre-wrap' }}>
                            {project.description}
                        </p>
                    </section>

                    <section style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>What we need</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {project.needs?.length > 0 ? (
                                project.needs.map((need, i) => (
                                    <span key={i} style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#F5F2EB',
                                        borderRadius: '12px',
                                        fontSize: '14px'
                                    }}>
                                        {need}
                                    </span>
                                ))
                            ) : (
                                <p style={{ color: '#999' }}>No specific needs listed yet.</p>
                            )}
                        </div>
                    </section>

                    <section style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Tags</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {project.tags?.map((tag, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    backgroundColor: '#F5F2EB',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#666'
                                }}>
                                    <Tag style={{ width: '12px', height: '12px' }} />
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar - Join Form */}
                <div>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                padding: '8px',
                                backgroundColor: '#FF440020',
                                borderRadius: '8px',
                                color: '#FF4400'
                            }}>
                                <Users style={{ width: '24px', height: '24px' }} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Join the Team</h3>
                        </div>

                        <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#999',
                                    marginBottom: '4px',
                                    display: 'block'
                                }}>Name</label>
                                <input
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F2EB',
                                        border: '2px solid transparent',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    value={joinForm.name}
                                    onChange={e => setJoinForm({ ...joinForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#999',
                                    marginBottom: '4px',
                                    display: 'block'
                                }}>Email</label>
                                <input
                                    required
                                    type="email"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F2EB',
                                        border: '2px solid transparent',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    value={joinForm.email}
                                    onChange={e => setJoinForm({ ...joinForm, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#999',
                                    marginBottom: '4px',
                                    display: 'block'
                                }}>Role</label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F2EB',
                                        border: '2px solid transparent',
                                        outline: 'none',
                                        fontSize: '14px'
                                    }}
                                    value={joinForm.role}
                                    onChange={e => setJoinForm({ ...joinForm, role: e.target.value })}
                                >
                                    <option>Developer</option>
                                    <option>Designer</option>
                                    <option>Marketer</option>
                                    <option>Product Manager</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#999',
                                    marginBottom: '4px',
                                    display: 'block'
                                }}>Message</label>
                                <textarea
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F2EB',
                                        border: '2px solid transparent',
                                        outline: 'none',
                                        fontSize: '14px',
                                        resize: 'none'
                                    }}
                                    placeholder="Why do you want to join?"
                                    value={joinForm.message}
                                    onChange={e => setJoinForm({ ...joinForm, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: '#FF4400',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
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
        </div>
    );
}
