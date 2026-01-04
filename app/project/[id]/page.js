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
        role: "Developer", // default
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
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Project not found 😕</h1>
                <Link href="/" className="text-primary hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-24">
            <div className="max-w-5xl mx-auto p-4 md:p-8">

                {/* Header */}
                <header className="mb-8 md:mb-12 pt-8">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                  ${project.phase === 'Ideation' ? 'bg-yellow-100 text-yellow-700' :
                                        project.phase === 'Design' ? 'bg-pink-100 text-pink-700' :
                                            project.phase === 'Development' ? 'bg-blue-100 text-blue-700' :
                                                project.phase === 'Launch' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`
                                }>
                                    {project.phase}
                                </span>
                                <span className="text-muted-foreground text-sm flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(project.created_at), 'MMMM d, yyyy')}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                        </div>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Link copied!");
                            }}
                            className="p-3 rounded-full bg-white border-2 border-black/10 hover:border-black transition-all"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">What we need</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.needs?.length > 0 ? (
                                    project.needs.map((need, i) => (
                                        <span key={i} className="px-4 py-2 bg-white border-2 border-black/5 rounded-xl text-sm font-medium">
                                            {need}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No specific needs listed yet.</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.tags?.map((tag, i) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Join Team Card */}
                        <div className="p-6 md:p-8 bg-white rounded-3xl border-2 border-black/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold">Join the Team</h3>
                            </div>

                            <form onSubmit={handleJoinSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Name</label>
                                    <input
                                        required
                                        className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 outline-none transition-all"
                                        value={joinForm.name}
                                        onChange={e => setJoinForm({ ...joinForm, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 outline-none transition-all"
                                        value={joinForm.email}
                                        onChange={e => setJoinForm({ ...joinForm, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Role</label>
                                    <select
                                        className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 outline-none transition-all"
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
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Message</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary/20 outline-none transition-all resize-none"
                                        placeholder="Why do you want to join?"
                                        value={joinForm.message}
                                        onChange={e => setJoinForm({ ...joinForm, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Sending..." : "Send Request"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
