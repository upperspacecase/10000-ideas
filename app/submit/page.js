"use client";

import { useState } from "react";
import { ArrowLeft, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SubmitIdea() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "SaaS",
    skills: "",
    author: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/backlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Idea submitted! It's now in the backlog.");
      setFormData({
        title: "",
        description: "",
        category: "SaaS",
        skills: "",
        author: ""
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl border-2 border-black/10 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Submit an Idea</h1>
              <p className="text-muted-foreground">Pitch a project for the studio to build.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Project Title</label>
              <input
                required
                type="text"
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all"
                placeholder="e.g. AI-Powered Plant Waterer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                rows={4}
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all resize-none"
                placeholder="What does it do? Who is it for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>SaaS</option>
                  <option>Mobile App</option>
                  <option>Hardware</option>
                  <option>Community</option>
                  <option>Tool</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Required Skills</label>
                <input
                  required
                  type="text"
                  className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all"
                  placeholder="e.g. React, Python"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Your Name / Handle</label>
              <input
                required
                type="text"
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all"
                placeholder="@username"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Submitting..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Submit Idea
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
