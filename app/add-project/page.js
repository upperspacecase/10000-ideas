
"use client";

import { useState } from "react";
import { ArrowRight, Globe, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function AddProjectPage() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/register-project", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to register project");

            setResult(data.project);
            toast.success("Project registered successfully!");
            setUrl("");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col p-4 md:p-8">
            <div className="max-w-xl mx-auto w-full pt-12 md:pt-24 space-y-8">
                <div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-black mb-4 inline-block">← Back to Dashboard</Link>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Add New Project</h1>
                    <p className="text-lg text-gray-500">Enter a URL to auto-import metadata.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 border-2 border-black/5 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 ml-1">Project URL</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="url"
                                    required
                                    placeholder="https://my-awesome-startup.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-black/10 bg-gray-50 focus:border-black focus:outline-none transition-all font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Scraping Metadata...
                                </>
                            ) : (
                                <>
                                    Import Project <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
                            <Check className="w-5 h-5" /> Successfully Imported:
                        </h3>

                        <Link href={`/project/${result.id}`} className="block group">
                            <div className="bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-green-500 hover:shadow-lg transition-all">
                                {result.image_url && (
                                    <div className="aspect-video w-full rounded-xl bg-gray-100 mb-4 overflow-hidden">
                                        <img
                                            src={result.image_url}
                                            alt={result.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{result.title}</h3>
                                <p className="text-gray-500 line-clamp-2">{result.description}</p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
