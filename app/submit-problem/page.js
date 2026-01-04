"use client";

import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SubmitProblem() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    problem: "",
    jobToBeDone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Problem submitted! We'll look into it.");
      setFormData({
        user: "",
        problem: "",
        jobToBeDone: ""
      });
    } catch (error) {
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
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Submit a Problem</h1>
              <p className="text-muted-foreground">Tell us what's broken so we can fix it.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">User Persona</label>
              <input
                required
                type="text"
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all"
                placeholder="e.g. Remote worker, freelance designer, busy parent"
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">The Problem</label>
              <textarea
                required
                rows={3}
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all resize-none"
                placeholder="What is painful, slow, or expensive?"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Job To Be Done</label>
              <textarea
                required
                rows={3}
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-black/10 outline-none transition-all resize-none"
                placeholder="When [situation], I want to [motivation], so I can [outcome]."
                value={formData.jobToBeDone}
                onChange={(e) => setFormData({ ...formData, jobToBeDone: e.target.value })}
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
                  <AlertCircle className="w-5 h-5" />
                  Submit Problem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
